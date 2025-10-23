<script setup lang="ts">
import { onMounted, ref } from "vue";
import Service from "./components/Service.vue";
import {
  addGroup,
  addService,
  addTag,
  deleteGroup,
  deleteService,
  getServiceGroups,
  type GetServiceGroupsResponse,
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
import { findTag, store } from "./store";
import { useUrlSearchParams } from "@vueuse/core";
import {
  FilePlusIcon,
  GroupIcon,
  LayoutGridIcon,
  LayoutListIcon,
  TagIcon,
} from "lucide-vue-next";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import ContextMenuSub from "./components/ui/context-menu/ContextMenuSub.vue";
import ContextMenuSubTrigger from "./components/ui/context-menu/ContextMenuSubTrigger.vue";
import ContextMenuSubContent from "./components/ui/context-menu/ContextMenuSubContent.vue";
import Input from "./components/ui/input/Input.vue";

const groups = ref<GetServiceGroupsResponse[] | null>(null);

async function refreshGroups() {
  const fetchedGroups = await getServiceGroups();

  groups.value = fetchedGroups;
  store.groups = fetchedGroups.map((group) => {
    return {
      id: group.id,
      title: group.title,
    };
  });
}

onMounted(async () => {
  refreshGroups();
});

const isEditMode = ref(false);
const editData = ref<ServiceDialogFormData | null>(null);

const onEditServiceSuccess = async () => {
  refreshGroups();
};

const handleDeleteService = async (service: GetServicesResponse) => {
  if (confirm("Service löschen?")) {
    try {
      await deleteService(service.id);
    } catch (error) {
      console.log(error);
    }

    refreshGroups();
  }
};

const onEditSuccess = async () => {
  refreshGroups();
};

const handleDeleteGroup = async (groupId: number) => {
  if (confirm("Gruppe löschen?")) {
    try {
      await deleteGroup(groupId);
    } catch (error) {
      console.log(error);
    }

    refreshGroups();
  }
};

const afterMove = async () => {
  refreshGroups();
};

const onAddTagSuccess = async (data: TagDialogFormData) => {
  try {
    await addTag({
      name: data.name,
      color: data.color,
    });
  } catch (error) {
    console.log(error);
  }

  refreshGroups();
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
    });
  } catch (error) {
    console.log(error);
  }

  refreshGroups();
};

const onAddGroupSuccess = async (data: { title: string }) => {
  try {
    await addGroup({
      title: data.title,
    });
  } catch (error) {
    console.log(error);
  }

  refreshGroups();
};

const showServiceDialog = ref(false);
const showGroupDialog = ref(false);
const showTagDialog = ref(false);

const params = useUrlSearchParams("history");

const compactMode = ref(params.compact === "1");

const searchText = ref("");
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger>
      <div class="h-screen p-3">
        <div class="container mx-auto">
          <div class="pl-3 space-x-2 mb-6 flex sticky right-6 top-6 z-30">
            <Input
              v-model="searchText"
              placeholder="Search name, description or tag:"
            />

            <Button
              v-if="isEditMode"
              class="!bg-orange-500 text-white"
              @click="isEditMode = false"
            >
              Fertig
            </Button>
            <Button
              v-if="!isEditMode"
              variant="outline"
              @click="isEditMode = true"
            >
              Bearbeiten
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button v-if="isEditMode"> Hinzufügen </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem @click="showServiceDialog = true">
                  <FilePlusIcon /> Service hinzufügen
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="showGroupDialog = true">
                  <GroupIcon /> Gruppe hinzufügen
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

          <template v-for="group in groups">
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
                  if (searchText.includes('tag:')) {
                    return service.tags.some((tag) =>
                      tag.name
                        .toLowerCase()
                        .includes(searchText.replace('tag:', '').toLowerCase())
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
                  @toggleVisibility="refreshGroups()"
                  @delete="handleDeleteService(service)"
                >
                  <Service
                    :compact="compactMode"
                    :id="'service' + service.id"
                    :title="service.title"
                    :description="service.description"
                    :link="service.link"
                    :icon_url="service.icon_url"
                    :icon_wrap="service.icon_wrap"
                    :tags="service.tags"
                    :isEnabled="service.enabled"
                  />
                </EditServiceWrapper>
              </template>
            </ServiceGroup>
          </template>
        </div>
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuSub>
        <ContextMenuSubTrigger inset> Hinzufügen </ContextMenuSubTrigger>
        <ContextMenuSubContent class="w-48">
          <ContextMenuItem @click="showServiceDialog = true">
            <FilePlusIcon /> Service
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem @click="showGroupDialog = true">
            <GroupIcon /> Gruppe
          </ContextMenuItem>
          <ContextMenuItem @click="showTagDialog = true">
            <TagIcon /> Tag
          </ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>

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
    </ContextMenuContent>
  </ContextMenu>
</template>
