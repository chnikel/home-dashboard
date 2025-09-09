<script setup lang="ts">
import type { ServiceTag } from "../api";
import ServiceIcon from "./ServiceIcon.vue";

defineProps<{
  compact?: boolean;
  title: string;
  description: string;
  link: string;
  icon_url: string;
  icon_wrap: boolean;
  tags: ServiceTag[];
}>();
</script>

<template>
  <a
    :href="link"
    class="p-4 lg:p-6 flex gap-3 text-white hover:bg-neutral-300/5 rounded-2xl"
    :class="{
      'w-min': compact,
    }"
  >
    <ServiceIcon :wrap="icon_wrap" :url="icon_url" />
    <div v-if="!compact">
      <h3 class="text-lg font-semibold line-clamp-1 flex gap-2 items-center">
        {{ title }}
      </h3>
      <p class="text-sm text-neutral-400 line-clamp-1">{{ description }}</p>
      <span
        v-for="tag in tags"
        :class="`bg-${tag.color}-100 text-${tag.color}-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-${tag.color}-900 dark:text-${tag.color}-300`"
      >
        {{ tag.name }}
      </span>
    </div>
  </a>
</template>
