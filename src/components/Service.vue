<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  link: string;
  icon_url: string;
  icon_wrap: boolean;
}>();
</script>

<template>
  <a
    :href="link"
    class="p-6 flex gap-3 text-white hover:bg-neutral-300/5 rounded-2xl"
  >
    <div
      class="w-16 h-16 bg-neutral-700/80 rounded-2xl shrink-0"
      :class="{
        'p-2 border-neutral-600 border': !icon_wrap,
      }"
    >
      <img
        class="block h-full w-full"
        :src="icon_url"
      />
    </div>
    <div>
      <h3 class="text-lg font-semibold line-clamp-1 flex gap-2 items-center">
        {{ title }}
      </h3>
      <p class="text-sm text-neutral-400 line-clamp-1">{{ description }}</p>
      <!-- <span
        class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
      >
        dwa
      </span> -->
    </div>
  </a>
</template>
