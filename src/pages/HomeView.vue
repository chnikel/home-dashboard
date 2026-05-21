<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useLocalStorage, useUrlSearchParams } from "@vueuse/core";
import {
  FilePlusIcon,
  FolderIcon,
  LayoutGridIcon,
  LayoutListIcon,
  TagIcon,
} from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { type GetServicesResponse } from "../api";
import EditServiceWrapper from "../components/EditServiceWrapper.vue";
import GroupDialog from "../components/GroupDialog.vue";
import Service from "../components/Service.vue";
import ServiceAppLayout from "../components/ServiceAppLayout.vue";
import ServiceDialog, {
  type ServiceDialogFormData,
} from "../components/ServiceDialog.vue";
import ServiceGroup from "../components/ServiceGroup.vue";
import TagDialog, { type TagDialogFormData } from "../components/TagDialog.vue";
import { findTag, store, updateLocalServicePings } from "../store";
import Header from "@/components/Header.vue";
import { useSavedSearch } from "@/composables/saved-search";
import AppsToolbar from "@/components/AppsToolbar.vue";
import { useFilteredServices } from "@/composables/filtered-services";
import ServiceRepository from "@/repositories/ServiceRepository";
import TagRepository from "@/repositories/TagRepository";
import GroupRepository from "@/repositories/GroupRepository";
import PageContent from "@/components/PageContent.vue";

async function refreshServices() {
  const groupsResponse = await GroupRepository.get();

  const groupedServicesResponse =
    await ServiceRepository.getGroupedBy("groupId");

  const servicesWithGroupName = Object.entries(groupedServicesResponse).map(
    ([groupId, services]) => {
      const group = groupsResponse.find(
        (group) => group.id?.toString() == groupId,
      );
      const groupTitle = group?.title || "";

      return {
        id: groupId,
        title: groupTitle,
        services,
      };
    },
  );

  if (servicesWithGroupName.findIndex((group) => group.id === "-1") === -1) {
    servicesWithGroupName.push({
      id: "-1",
      services: [],
      title: "",
    });
  }

  store.groups = servicesWithGroupName;
}

onMounted(async () => {
  refreshServices();
});

const isEditMode = ref(false);
const editData = ref<ServiceDialogFormData | null>(null);

const onEditServiceSuccess = async () => {
  refreshServices();
};

const handleDeleteService = async (service: GetServicesResponse) => {
  if (confirm("Service löschen?")) {
    try {
      await ServiceRepository.delete(service.id);
    } catch (error) {
      console.log(error);
    }

    refreshServices();
  }
};

const onEditSuccess = async () => {
  refreshServices();
};

const handleDeleteGroup = async (groupId: string) => {
  if (confirm("Gruppe löschen?")) {
    try {
      await GroupRepository.delete(groupId);
    } catch (error) {
      console.log(error);
    }

    refreshServices();
  }
};

const afterMove = async () => {
  refreshServices();
};

const onAddTagSuccess = async (data: TagDialogFormData) => {
  try {
    await TagRepository.create({
      name: data.name,
      color: data.color,
      weight: data.weight,
    });
  } catch (error) {
    console.log(error);
  }

  refreshServices();
};

const onAddService = async (data: ServiceDialogFormData) => {
  const tags = (data.tagIds || []).reduce<string[]>((acc, id) => {
    const tag = findTag(id);
    if (tag) {
      acc.push(tag.name);
    }

    return acc;
  }, []);

  try {
    await ServiceRepository.create({
      title: data.title,
      description: data.description,
      link: data.link,
      icon_url: data.icon_url,
      icon_wrap: data.icon_wrap,
      enabled: data.enabled,
      groupId: data.groupId,
      tags,
      bgColor: data.bgColor,
    });
  } catch (error) {
    console.log(error);
  }

  refreshServices();
};

const onAddGroupSuccess = async (data: { title: string }) => {
  try {
    await GroupRepository.create({
      title: data.title,
    });
  } catch (error) {
    console.log(error);
  }

  refreshServices();
};

const showServiceDialog = ref(false);
const showGroupDialog = ref(false);
const showTagDialog = ref(false);

const params = useUrlSearchParams("history");

const compactMode = useLocalStorage(
  "compact_mode",
  params.compact === "1" || false,
);

onMounted(async () => {
  updateLocalServicePings();

  const pingInterval = setInterval(() => {
    console.log("Refreshing pings");

    updateLocalServicePings();
  }, 60000);

  return () => {
    clearInterval(pingInterval);
  };
});

const {
  searchText,
  removeItem: removeSavedSearchByText,
  savedTabs,
  toggle: handleSavedSearchClick,
  saveItem: saveSearch,
  canSave: canSaveSearch,
} = useSavedSearch();

const { services: filteredServiceGroups, totalCount: totalServiceCount } =
  useFilteredServices(searchText, isEditMode);
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger>
      <div class="h-screen overflow-auto">
        <Header
          v-model:editMode="isEditMode"
          v-model:searchText="searchText"
          :disableSaveSearch="!canSaveSearch"
          @addGroup="showGroupDialog = true"
          @addService="showServiceDialog = true"
          @addTags="showTagDialog = true"
          @saveSearch="saveSearch()"
        />

        <AppsToolbar
          :totalCount="totalServiceCount"
          :savedTabs="savedTabs"
          :searchText="searchText"
          v-model:compactMode="compactMode"
          @saveSearch="handleSavedSearchClick($event)"
          @removeSearch="removeSavedSearchByText($event)"
        />

        <ServiceDialog
          :open="showServiceDialog"
          :handleClose="() => (showServiceDialog = false)"
          @submit="onAddService"
          title="Service hinzufügen"
          submitButton="Hinzufügen"
        />

        <GroupDialog
          :open="showGroupDialog"
          :data="editData"
          :handleClose="() => (showGroupDialog = false)"
          @submit="onAddGroupSuccess"
          title="Gruppe hinzufügen"
          submitButton="Hinzufügen"
        />

        <TagDialog
          :open="showTagDialog"
          :handleClose="() => (showTagDialog = false)"
          @submit="onAddTagSuccess"
          title="Tag hinzufügen"
          submitButton="Hinzufügen"
        />

        <PageContent class="flex gap-4 flex-col p-4 pt-0">
          <template v-for="item in filteredServiceGroups">
            <ServiceGroup
              v-if="item.services.length > 0 || isEditMode"
              :serviceCount="item.services.length"
              :compact="compactMode"
              :id="item.group.id"
              :title="item.group.id == null ? '' : item.group.title"
              :edit="isEditMode"
              @edit="onEditSuccess()"
              @delete="handleDeleteGroup(item.group.id)"
              @move="afterMove()"
            >
              <template v-for="service in item.services">
                <EditServiceWrapper
                  v-if="service.enabled || isEditMode"
                  :draggable="isEditMode"
                  :id="service.id"
                  :service="service"
                  :edit="isEditMode"
                  @edit="onEditServiceSuccess()"
                  @toggleVisibility="refreshServices()"
                  @toggleTag="refreshServices()"
                  @delete="handleDeleteService(service)"
                >
                  <Service
                    v-if="!compactMode"
                    :compact="compactMode"
                    :id="service.id"
                    :title="service.title"
                    :description="service.description"
                    :link="service.link"
                    :icon_url="service.icon_url"
                    :icon_wrap="service.icon_wrap"
                    :tags="service.tags"
                    :isEnabled="service.enabled"
                    :bgColor="service.bgColor"
                  />
                  <ServiceAppLayout
                    v-else
                    :compact="compactMode"
                    :id="service.id"
                    :title="service.title"
                    :description="service.description"
                    :link="service.link"
                    :icon_url="service.icon_url"
                    :icon_wrap="service.icon_wrap"
                    :tags="service.tags"
                    :isEnabled="service.enabled"
                    :bgColor="service.bgColor"
                  />
                </EditServiceWrapper>
              </template>
            </ServiceGroup>
          </template>
          <template v-if="filteredServiceGroups.length === 0">
            <div
              class="border p-8 rounded-xl text-center border-dashed text-white/30"
            >
              Keine Services
            </div>
          </template>
        </PageContent>
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem @click="showServiceDialog = true">
        <FilePlusIcon /> Service hinzufügen
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem @click="showGroupDialog = true">
        <FolderIcon /> Gruppe hinzufügen
      </ContextMenuItem>
      <ContextMenuItem @click="showTagDialog = true">
        <TagIcon /> Tag hinzufügen
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem
        inset
        @click="isEditMode = !isEditMode"
      >
        <template v-if="isEditMode"> Bearbeiten beenden </template>
        <template v-else> Bearbeiten </template>
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem
        @click="compactMode = false"
        :disabled="!compactMode"
      >
        <LayoutListIcon /> Normal View
      </ContextMenuItem>
      <ContextMenuItem
        @click="compactMode = true"
        :disabled="compactMode"
      >
        <LayoutGridIcon /> Compact View
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem
        inset
        @click="updateLocalServicePings"
      >
        Pings neu laden
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
