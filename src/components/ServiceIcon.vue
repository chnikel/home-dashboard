<script setup lang="ts">
defineProps<{
  wrap: boolean;
  url: string;
}>();
</script>

<template>
  <div
    class="w-16 h-16 bg-neutral-700/80 rounded-2xl shrink-0 self-center overflow-hidden transition-all"
    :class="{
      'p-2 border-neutral-600 border': !wrap,
    }"
  >
    <img
      class="block h-full w-full"
      :src="url"
    />
  </div>
</template>
