<script setup lang="ts">
import { EyeOffIcon } from "lucide-vue-next";
import type { ServiceTag } from "../api";
import ServiceIcon from "./ServiceIcon.vue";
import ServiceTags from "./ServiceTags.vue";
import ServiceInfoIcon from "./ServiceInfoIcon.vue";

defineProps<{
  compact?: boolean;
  title: string;
  description: string;
  link: string;
  icon_url: string;
  icon_wrap: boolean;
  tags: ServiceTag[];
  isEnabled?: boolean;
}>();
</script>

<template>
  <a
    :href="link"
    target="_blank"
    class="lg:p-4 text-white hover:bg-neutral-300/5 rounded-2xl border grid gap-x-3"
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
    />

    <ServiceIcon
      style="grid-area: icon"
      :wrap="icon_wrap"
      :url="icon_url"
    />
    <template v-if="!compact">
      <h3
        style="grid-area: title"
        class="text-lg font-semibold line-clamp-1 flex gap-2 items-center"
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
