<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="text-white">
    <h2 class="text-2xl font-light py-2 px-4">{{ title }}</h2>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 lg:gap-2 lg:gap-y-4"
    >
      <slot />
    </div>
  </div>
</template>
