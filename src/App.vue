<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";
import Service from "./components/Service.vue";
import {
  addGroup,
  addService,
  addTag,
  deleteGroup,
  deleteService,
  getServiceGroups,
  updateService,
  type GetServiceGroupsResponse,
  type GetServicesResponse,
} from "./api";
import ServiceEditForm, {
  type SubmitData,
} from "./components/ServiceEditForm.vue";
import EditServiceWrapper from "./components/EditServiceWrapper.vue";
import ServiceGroup from "./components/ServiceGroup.vue";
import type { AddGroupSubmitData } from "./components/GroupEditForm.vue";
import GroupEditForm from "./components/GroupEditForm.vue";
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

const groups = ref<GetServiceGroupsResponse[] | null>(null);

onMounted(async () => {
  groups.value = await getServiceGroups();
});

const isEditMode = ref(false);
const editServiceId = ref<number | null>(null);
const editData = ref<SubmitData | null>(null);
const editServiceDialog = useTemplateRef<HTMLDialogElement>(
  "edit-service-dialog"
);

const editService = (service: GetServicesResponse) => {
  editServiceId.value = service.id;
  editData.value = {
    title: service.title,
    description: service.description,
    link: service.link,
    icon_url: service.icon_url,
    icon_wrap: service.icon_wrap,
    enabled: service.enabled,
    groupId: service.groupId,
    tags: service.tags,
  };

  editServiceDialog.value?.showModal();
};

const handleEditService = async (data: SubmitData) => {
  if (!editServiceId.value) {
    alert("Keine Service ID");
    return;
  }
  const tags = data.tags.map((t) => t.name);

  try {
    await updateService(editServiceId.value, {
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

  groups.value = await getServiceGroups();
};

const handleDeleteService = async (service: GetServicesResponse) => {
  if (confirm("Service löschen?")) {
    try {
      await deleteService(service.id);
    } catch (error) {
      console.log(error);
    }

    groups.value = await getServiceGroups();
  }
};

const handleAddGroup = async (data: AddGroupSubmitData) => {
  try {
    await addGroup(data);
  } catch (error) {
    console.log(error);
  }

  groups.value = await getServiceGroups();
};

const onEditSuccess = async () => {
  groups.value = await getServiceGroups();
};

const handleDeleteGroup = async (groupId: number) => {
  if (confirm("Gruppe löschen?")) {
    try {
      await deleteGroup(groupId);
    } catch (error) {
      console.log(error);
    }

    groups.value = await getServiceGroups();
  }
};

const afterMove = async () => {
  groups.value = await getServiceGroups();
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

  groups.value = await getServiceGroups();
};

const onAddService = async (data: ServiceDialogFormData) => {
  try {
    await addService({
      title: data.title,
      description: data.description,
      link: data.link,
      icon_url: data.icon_url,
      icon_wrap: data.icon_wrap,
      enabled: data.enabled,
      groupId: null,
      tags: [],
    });
  } catch (error) {
    console.log(error);
  }

  groups.value = await getServiceGroups();
};

const onAddGroupSuccess = async (data: { title: string }) => {
  try {
    await addGroup({
      title: data.title,
    });
  } catch (error) {
    console.log(error);
  }

  groups.value = await getServiceGroups();
};

const showServiceGroupDialog = ref(false);
const showGroupDialog = ref(false);
const showTagDialog = ref(false);
</script>

<template>
  <div class="h-screen p-3">
    <div class="container mx-auto">
      <div class="space-x-2 mb-6 flex justify-end absolute right-6 top-6 z-30">
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
            <DropdownMenuItem @click="showServiceGroupDialog = true">
              Service hinzufügen
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="showGroupDialog = true">
              Gruppe hinzufügen
            </DropdownMenuItem>
            <DropdownMenuItem @click="showTagDialog = true">
              Tag hinzufügen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ServiceDialog
        :open="showServiceGroupDialog"
        :handleClose="() => (showServiceGroupDialog = false)"
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

      <dialog ref="add-group-dialog">
        <GroupEditForm
          method="dialog"
          @submit="handleAddGroup($event)"
        />
      </dialog>

      <dialog ref="edit-service-dialog">
        <ServiceEditForm
          method="dialog"
          :initial="editData || undefined"
          @submit="handleEditService($event)"
        />
      </dialog>

      <template v-for="group in groups">
        <ServiceGroup
          v-if="group.services.length > 0 || isEditMode"
          :id="group.id"
          :title="group.id == null ? 'Keine Gruppe' : group.title"
          :edit="isEditMode"
          :editable="!!group.id"
          :deletable="!!group.id"
          @edit="onEditSuccess()"
          @delete="handleDeleteGroup(group.id)"
          @move="afterMove()"
        >
          <template v-for="service in group.services">
            <EditServiceWrapper
              v-if="service.enabled || isEditMode"
              :draggable="isEditMode"
              :id="service.id"
              :edit="isEditMode"
              @edit="editService(service)"
              @delete="handleDeleteService(service)"
            >
              <Service
                :id="'service' + service.id"
                :title="service.title"
                :description="service.description"
                :link="service.link"
                :icon_url="service.icon_url"
                :icon_wrap="service.icon_wrap"
                :tags="service.tags"
              />
            </EditServiceWrapper>
          </template>
        </ServiceGroup>
      </template>
    </div>
  </div>
</template>
