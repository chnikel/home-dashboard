<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";
import Service from "./components/Service.vue";
import { getServices, type GetServicesResponse } from "./api";
import ServiceEditForm from "./components/ServiceEditForm.vue";

const services = ref<GetServicesResponse[] | null>(null);

onMounted(async () => {
  services.value = await getServices();
});

const dialog = useTemplateRef<HTMLDialogElement>("dialog");

const handleAddService = (data: any) => {
  console.log(data);
};
</script>

<template>
  <div class="h-screen bg-stone-800 p-3">
    <div>
      <button @click="dialog.showModal()">Service hinzufügen</button>
    </div>

    <dialog ref="dialog">
      <p>Greetings, one and all!</p>
      <ServiceEditForm
        method="dialog"
        @submit="handleAddService($event)"
      />
    </dialog>

    <div class="grid grid-cols-1 md:grid-cols-2">
      <Service
        v-for="service in services"
        :title="service.title"
        :description="service.description"
        :link="service.link"
        :icon_url="service.icon_url"
      />
    </div>
  </div>
</template>
