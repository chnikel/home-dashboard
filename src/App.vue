<script setup lang="ts">
import { onMounted, ref } from "vue";
import Service from "./components/Service.vue";
import {
  addGroup,
  addService,
  addTag,
  deleteGroup,
  deleteService,
  getGroups,
  getServicesGroupBy,
  type GetServicesResponse,
} from "./api";
import EditServiceWrapper from "./components/EditServiceWrapper.vue";
import ServiceGroup from "./components/ServiceGroup.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Button from "./components/ui/button/Button.vue";
import GroupDialog from "./components/GroupDialog.vue";
import TagDialog, { type TagDialogFormData } from "./components/TagDialog.vue";
import ServiceDialog, {
  type ServiceDialogFormData,
} from "./components/ServiceDialog.vue";
import { findTag, store, updateLocalServicePings } from "./store";
import { useUrlSearchParams } from "@vueuse/core";
import {
  FilePlusIcon,
  FolderIcon,
  LayoutGridIcon,
  LayoutListIcon,
  PenIcon,
  PlusIcon,
  SaveIcon,
  SearchIcon,
  TagIcon,
} from "lucide-vue-next";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import ServiceAppLayout from "./components/ServiceAppLayout.vue";
import InputGroup from "./components/ui/input-group/InputGroup.vue";
import InputGroupInput from "./components/ui/input-group/InputGroupInput.vue";
import InputGroupAddon from "./components/ui/input-group/InputGroupAddon.vue";

async function refreshServices() {
  const groupsResponse = await getGroups();

  const groupedServicesResponse = await getServicesGroupBy("groupId");

  const servicesWithGroupName = Object.entries(groupedServicesResponse).map(
    ([groupId, services]) => {
      const group = groupsResponse.find(
        (group) => group.id?.toString() == groupId
      );
      const groupTitle = group?.title || "";

      return {
        id: groupId,
        title: groupTitle,
        services,
      };
    }
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
      await deleteService(service.id);
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
      await deleteGroup(groupId);
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
    await addTag({
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
    await addService({
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
    await addGroup({
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

const compactMode = ref(params.compact === "1");

const searchText = ref("");

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
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger>
      <div class="overflow-auto">
        <div class="h-screen p-4 max-w-6xl mx-auto">
          <div
            class="mx-auto flex gap-2 rounded-lg bg-neutral-900 p-4 shadow-lg outline"
          >
            <InputGroup>
              <InputGroupInput
                v-model="searchText"
                placeholder="Search name, description or #tag"
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>

            <Button
              v-if="isEditMode"
              class="!bg-orange-500"
              @click="isEditMode = false"
              size="icon"
            >
              <SaveIcon color="white" />
            </Button>
            <Button
              v-if="!isEditMode"
              variant="outline"
              @click="isEditMode = true"
              size="icon"
            >
              <PenIcon />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button v-if="isEditMode"> <PlusIcon /> </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem @click="showServiceDialog = true">
                  <FilePlusIcon /> Service hinzufügen
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="showGroupDialog = true">
                  <FolderIcon /> Gruppe hinzufügen
                </DropdownMenuItem>
                <DropdownMenuItem @click="showTagDialog = true">
                  <TagIcon /> Tag hinzufügen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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

          <div class="flex gap-4 flex-col mt-6">
            <template v-for="group in store.groups">
              <ServiceGroup
                v-if="
                  (group.services.length > 0 &&
                    group.services.filter((s) => s.enabled).length > 0) ||
                  isEditMode
                "
                :compact="compactMode"
                :id="group.id"
                :title="group.id == null ? '' : group.title"
                :edit="isEditMode"
                @edit="onEditSuccess()"
                @delete="handleDeleteGroup(group.id)"
                @move="afterMove()"
              >
                <template
                  v-for="service in group.services.filter((service) => {
                    if (searchText.includes('#')) {
                      return service.tags.some((tag) =>
                        tag.name
                          .toLowerCase()
                          .includes(searchText.replace('#', '').toLowerCase())
                      );
                    }

                    return (service.title + ' ' + service.description)
                      .toLowerCase()
                      .includes(searchText.toLowerCase());
                  })"
                >
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
                      :bgColor="service.bgColor"
                    />
                  </EditServiceWrapper>
                </template>
              </ServiceGroup>
            </template>
          </div>
        </div>
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
