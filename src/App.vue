<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";
import Service from "./components/Service.vue";
import {
  addService,
  deleteService,
  getServices,
  updateService,
  type GetServicesResponse,
} from "./api";
import ServiceEditForm, {
  type SubmitData,
} from "./components/ServiceEditForm.vue";
import EditServiceWrapper from "./components/EditServiceWrapper.vue";

const services = ref<GetServicesResponse[] | null>(null);

onMounted(async () => {
  services.value = await getServices();
});

const addServiceDialog =
  useTemplateRef<HTMLDialogElement>("add-service-dialog");

const handleAddService = async (data: SubmitData) => {
  try {
    await addService(data);
  } catch (error) {
    console.log(error);
  }

  services.value = await getServices();
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

  services.value = await getServices();
};

const handleDeleteService = async (service: GetServicesResponse) => {
  if (confirm("Service löschen?")) {
    try {
      await deleteService(service.id);
    } catch (error) {
      console.log(error);
    }

    services.value = await getServices();
  }
};
</script>

<template>
  <div class="h-screen p-3">
    <div class="space-x-2 mb-6">
      <button @click="addServiceDialog?.showModal()">Service hinzufügen</button>
      <button @click="toggleEdit()">
        {{ isEditMode ? "Bearbeiten beenden" : "Bearbeiten" }}
      </button>
    </div>

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

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 lg:gap-2 lg:gap-y-4">
      <EditServiceWrapper
        v-for="service in services"
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
    </div>
  </div>
</template>
