<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  link: string;
  icon_url: string;
}>();
</script>

<template>
  <a
    :href="link"
    class="p-6 flex gap-3 text-white hover:bg-stone-300/5 rounded-2xl"
  >
    <div
      class="w-16 h-16 bg-stone-700/80 border-stone-600 border rounded-2xl shrink-0 p-2"
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
      <p class="text-sm text-fg-dimmed line-clamp-1">{{ description }}</p>
    </div>
  </a>
</template>
