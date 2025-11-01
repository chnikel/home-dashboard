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
  compact?: boolean;
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
    return false;
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
    class="lg:p-4 text-white hover:bg-neutral-300/5 rounded-2xl border grid gap-x-3 relative"
    :class="{
      'w-min layout-compact': compact,
      'p-2 py-3 layout-normal': !compact,
    }"
  >
    <div
      v-if="!isEnabled"
      class="absolute inset-0 flex justify-center items-center bg-neutral-900/80 rounded-2xl"
    >
      <EyeOffIcon />
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
    />

    <ServiceIcon
      style="grid-area: icon"
      :wrap="icon_wrap"
      :url="icon_url"
    />
    <template v-if="!compact">
      <h3
        style="grid-area: title"
        class="text-lg font-semibold flex gap-2 items-center"
      >
        <span class="relative flex size-3">
          <span
            class="absolute inline-flex h-full w-full animate-ping animation-duration-[1.9s] rounded-full opacity-75"
            :class="{
              'bg-red-400': !isReachable,
              'bg-green-400': isReachable,
            }"
          ></span>
          <span
            class="relative inline-flex size-3 rounded-full"
            :class="{
              'bg-red-500': !isReachable,
              'bg-green-500': isReachable,
            }"
          ></span
        ></span>
        {{ title }}
      </h3>
      <p
        style="grid-area: description"
        class="text-sm text-neutral-400 line-clamp-1"
      >
        {{ description }}
      </p>
      <ServiceTags :tags="tags" />
    </template>
  </a>
</template>

<style lang="css" scoped>
.layout-compact {
  grid-template-columns: auto;
  grid-template-areas:
    "icon"
    "title";
}

.layout-normal {
  grid-template-columns: auto 1fr;
  grid-template-areas:
    "icon title"
    "icon description"
    "icon tags";
}
</style>
