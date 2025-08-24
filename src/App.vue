<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";
import Service from "./components/Service.vue";
import {
  addGroup,
  addService,
  deleteGroup,
  deleteService,
  getServiceGroups,
  updateGroup,
  updateService,
  type AddGroupRequest,
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

const groups = ref<GetServiceGroupsResponse[] | null>(null);

onMounted(async () => {
  groups.value = await getServiceGroups();
});

const addServiceDialog =
  useTemplateRef<HTMLDialogElement>("add-service-dialog");

const handleAddService = async (data: SubmitData) => {
  try {
    await addService(data);
  } catch (error) {
    console.log(error);
  }

  groups.value = await getServiceGroups();
};

const isEditMode = ref(false);
const editServiceId = ref<number | null>(null);
const editData = ref<SubmitData | null>(null);
const editServiceDialog = useTemplateRef<HTMLDialogElement>(
  "edit-service-dialog"
);

const toggleEdit = () => (isEditMode.value = !isEditMode.value);

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
  };

  editServiceDialog.value?.showModal();
};

const handleEditService = async (data: SubmitData) => {
  if (!editServiceId.value) {
    alert("Keine Service ID");
    return;
  }

  try {
    await updateService(editServiceId.value, data);
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

const addGroupDialog = useTemplateRef<HTMLDialogElement>("add-group-dialog");

const handleAddGroup = async (data: AddGroupSubmitData) => {
  try {
    await addGroup(data);
  } catch (error) {
    console.log(error);
  }

  groups.value = await getServiceGroups();
};

const handleEditGroup = async (id: number, data: AddGroupRequest) => {
  try {
    await updateGroup(id, data);
  } catch (error) {
    console.log(error);
  }

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
</script>

<template>
  <div class="h-screen p-3">
    <div class="space-x-2 mb-6">
      <button @click="addServiceDialog?.showModal()">Service hinzufügen</button>
      <button @click="addGroupDialog?.showModal()">Gruppe hinzufügen</button>
      <button
        @click="toggleEdit()"
        :class="{
          '!bg-orange-500': isEditMode,
        }"
      >
        {{ isEditMode ? "Bearbeiten beenden" : "Bearbeiten" }}
      </button>
    </div>

    <dialog ref="add-group-dialog">
      <GroupEditForm
        method="dialog"
        @submit="handleAddGroup($event)"
      />
    </dialog>

    <dialog ref="add-service-dialog">
      <ServiceEditForm
        method="dialog"
        @submit="handleAddService($event)"
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
        :edit="isEditMode"
        :title="group.id == null ? 'Keine Gruppe' : group.title"
        @edit="handleEditGroup(group.id, $event)"
        @delete="handleDeleteGroup(group.id)"
      >
        <template v-for="service in group.services">
          <EditServiceWrapper
            v-if="service.enabled || isEditMode"
            :edit="isEditMode"
            @edit="editService(service)"
            @delete="handleDeleteService(service)"
          >
            <Service
              :title="service.title"
              :description="service.description"
              :link="service.link"
              :icon_url="service.icon_url"
              :icon_wrap="service.icon_wrap"
            />
          </EditServiceWrapper>
        </template>
      </ServiceGroup>
    </template>
  </div>
</template>
