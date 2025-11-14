<script setup lang="ts">
import { EyeOffIcon } from "lucide-vue-next";
import type { ServiceTag } from "../api";
import ServiceIcon from "./ServiceIcon.vue";
import ServiceTags from "./ServiceTags.vue";
import ServiceInfoIcon from "./ServiceInfoIcon.vue";
import { computed } from "vue";
import { store } from "@/store";

const props = defineProps<{
  id: number;
  title: string;
  description: string;
  link: string;
  icon_url: string;
  icon_wrap: boolean;
  tags: ServiceTag[];
  isEnabled?: boolean;
}>();

const isReachable = computed(() => {
  if (store.servicePings.length === 0) {
    return true;
  }

  const pingData = store.servicePings.find(
    (ping) => ping.serviceId == props.id
  );

  if (!pingData) {
    return false;
  }

  return pingData.isReachable;
});
</script>

<template>
  <a
    :href="link"
    target="_blank"
    class="lg:p-4 text-white hover:bg-neutral-300/5 rounded-2xl border grid gap-x-3 relative p-2 py-3 layout-normal"
    :class="{
      'border-red-600': !isReachable,
    }"
  >
    <div
      v-if="!isReachable"
      class="absolute inset-0 flex justify-center items-center bg-neutral-900/80 rounded-2xl"
    >
      <span class="tracking-wider text-red-700 font-bold uppercase text-xl">Offline</span>
    </div>

    <ServiceInfoIcon
      :show-deprecated-icon="
        tags.findIndex((t) => t.name.toLowerCase() == 'deprecated') != -1
      "
      :show-live-icon="
        tags.findIndex((t) => t.name.toLowerCase() == 'live') != -1
      "
      :show-device-icon="
        tags.findIndex((t) => t.name.toLowerCase() == 'physical') != -1
      "
      :show-disconnected-icon="!isReachable"
    />

    <ServiceIcon
      style="grid-area: icon"
      :wrap="icon_wrap"
      :url="icon_url"
    />
    <h3
      style="grid-area: title"
      class="text-lg font-semibold flex gap-2 items-center"
    >
      {{ title }}
    </h3>
    <p
      style="grid-area: description"
      class="text-sm text-neutral-400 line-clamp-1"
    >
      {{ description }}
    </p>
    <ServiceTags :tags="tags" />
  </a>
</template>

<style lang="css" scoped>
.layout-normal {
  grid-template-columns: auto 1fr;
  grid-template-areas:
    "icon title"
    "icon description"
    "icon tags";
}
</style>
