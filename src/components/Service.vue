<script setup lang="ts">
import { EyeOffIcon } from "lucide-vue-next";
import type { ServiceTag } from "../api";
import ServiceIcon from "./ServiceIcon.vue";
import { computed } from "vue";

const props = defineProps<{
  compact?: boolean;
  title: string;
  description: string;
  link: string;
  icon_url: string;
  icon_wrap: boolean;
  tags: ServiceTag[];
  isEnabled?: boolean;
}>();

const sortedTags = computed(() => {
  return props.tags.sort((a, b) => {
    return b.weight - a.weight;
  });
});
</script>

<template>
  <a
    :href="link"
    target="_blank"
    class="lg:p-6 text-white hover:bg-neutral-300/5 rounded-2xl border grid gap-x-3"
    style="
      grid-template-columns: auto 1fr;
      grid-template-areas:
        'icon title'
        'icon description'
        'icon tags';
    "
    :class="{
      'w-min': compact,
      'p-2 py-3': !compact,
    }"
  >
    <div
      v-if="!isEnabled"
      class="absolute inset-0 flex justify-center items-center bg-neutral-900/80 rounded-2xl"
    >
      <EyeOffIcon />
    </div>
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
      <div style="grid-area: tags">
        <span
          v-for="tag in sortedTags"
          :class="`bg-${tag.color}-100 text-${tag.color}-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-${tag.color}-900 dark:text-${tag.color}-300`"
        >
          {{ tag.name }}
        </span>
      </div>
    </template>
  </a>
</template>
