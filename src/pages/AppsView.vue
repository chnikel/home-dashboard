<script setup lang="ts">
import Header from "@/components/Header.vue";
import LayoutSwitcher from "@/components/LayoutSwitcher.vue";
import PageContent from "@/components/PageContent.vue";
import Badge from "@/components/ui/badge/Badge.vue";
import ButtonGroup from "@/components/ui/button-group/ButtonGroup.vue";
import Button from "@/components/ui/button/Button.vue";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import DropdownMenu from "@/components/ui/dropdown-menu/DropdownMenu.vue";
import DropdownMenuContent from "@/components/ui/dropdown-menu/DropdownMenuContent.vue";
import DropdownMenuItem from "@/components/ui/dropdown-menu/DropdownMenuItem.vue";
import DropdownMenuSeparator from "@/components/ui/dropdown-menu/DropdownMenuSeparator.vue";
import DropdownMenuTrigger from "@/components/ui/dropdown-menu/DropdownMenuTrigger.vue";
import InputGroup from "@/components/ui/input-group/InputGroup.vue";
import InputGroupAddon from "@/components/ui/input-group/InputGroupAddon.vue";
import InputGroupButton from "@/components/ui/input-group/InputGroupButton.vue";
import InputGroupInput from "@/components/ui/input-group/InputGroupInput.vue";
import { useFilteredServices } from "@/composables/filtered-services";
import { useLayoutMode } from "@/composables/layout-mode";
import { usePinnedServices } from "@/composables/pinned-service";
import { useSavedSearch } from "@/composables/saved-search";
import GroupRepository from "@/repositories/GroupRepository";
import ServiceRepository from "@/repositories/ServiceRepository";
import TagRepository from "@/repositories/TagRepository";
import {
  CheckIcon,
  CircleXIcon,
  FilePlusIcon,
  FolderIcon,
  LayoutGridIcon,
  LayoutListIcon,
  PenIcon,
  PlusIcon,
  SaveIcon,
  SearchIcon,
  TagIcon,
  XIcon,
} from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { type GetServicesResponse } from "../api";
import EditServiceWrapper from "../components/EditServiceWrapper.vue";
import GroupDialog, { type GroupDialogFormData } from "../components/GroupDialog.vue";
import Service from "../components/Service.vue";
import ServiceAppLayout from "../components/ServiceAppLayout.vue";
import ServiceGroup from "../components/ServiceGroup.vue";
import TagDialog, { type TagDialogFormData } from "../components/TagDialog.vue";
import { store, updateLocalServicePings } from "../store";

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
const editData = ref<GroupDialogFormData | null>(null);

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

const showGroupDialog = ref(false);
const showTagDialog = ref(false);

const { isCompact: compactMode } = useLayoutMode();

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

const { isPinned } = usePinnedServices();

const router = useRouter();

const onNewServiceClick = () => {
  router.push({ name: "service-add" });
};
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger>
      <div class="h-screen overflow-auto">
        <Header>
          <template #center>
            <InputGroup class="w-60 sm:w-80 ml-auto md:ml-0">
              <InputGroupInput
                v-model="searchText"
                placeholder="Search name, description or #tag"
                @keydown.enter="saveSearch()"
              />
              <InputGroupAddon>
                <SearchIcon v-if="!searchText" />
                <InputGroupButton
                  v-else
                  size="icon-xs"
                  @click="searchText = ''"
                >
                  <CircleXIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>

            <Button
              size="icon"
              variant="outline"
              :disabled="!canSaveSearch"
              @click="saveSearch()"
            >
              <SaveIcon />
            </Button>
          </template>
          <template #end> </template>
        </Header>

        <PageContent
          class="p-4 grid gap-2 items-center grid-cols-2 sm:grid-cols-3"
        >
          <div class="justify-self-start shrink-0">
            <Badge variant="outline">
              {{ totalServiceCount }}
            </Badge>
            Services
          </div>

          <ButtonGroup
            class="overflow-scroll [scrollbar-width:none] justify-self-end sm:justify-self-center"
            v-if="savedTabs.length > 0"
          >
            <ContextMenu v-for="savedTab in savedTabs">
              <ContextMenuTrigger>
                <Button
                  class="cursor-pointer"
                  :variant="
                    searchText === savedTab.text ? 'default' : 'outline'
                  "
                  @click="handleSavedSearchClick(savedTab.text)"
                >
                  {{ savedTab.text }}
                </Button>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  variant="destructive"
                  @click="removeSavedSearchByText(savedTab.text)"
                >
                  <XIcon /> Löschen
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </ButtonGroup>

          <div
            class="col-start-2 justify-self-end sm:justify-self-end sm:col-start-auto"
          >
            <div class="flex items-center gap-3">
              <LayoutSwitcher />
              <Button
                v-if="!isEditMode"
                variant="outline"
                @click="isEditMode = true"
              >
                <PenIcon />
                <span class="text-white hidden md:inline">Bearbeiten</span>
              </Button>
              <DropdownMenu v-if="isEditMode">
                <DropdownMenuTrigger>
                  <Button>
                    <PlusIcon />
                    <span class="hidden md:inline">Hinzufügen</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem @click="onNewServiceClick()">
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
              <Button
                v-if="isEditMode"
                class="!bg-orange-500"
                @click="isEditMode = false"
              >
                <CheckIcon color="white" />
                <span class="text-white hidden md:inline">Fertig</span>
              </Button>
            </div>
          </div>
        </PageContent>

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

        <PageContent class="flex gap-4 flex-col px-4 pb-4">
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
                    :data="service"
                  />
                  <ServiceAppLayout
                    v-else
                    :data="service"
                    :isPinned="isPinned(service.id.toString())"
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
      <ContextMenuItem @click="onNewServiceClick()">
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
