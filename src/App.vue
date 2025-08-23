<script setup lang="ts">
import { onMounted, ref } from "vue";
import Service from "./components/Service.vue";
import { getServices, type GetServicesResponse } from "./api";

const services = ref<GetServicesResponse[] | null>(null);

onMounted(async () => {
  services.value = await getServices();
});
</script>

<template>
  <div class="h-screen bg-stone-800 p-3">
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
