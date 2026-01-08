<script setup lang="ts">
defineProps<{
  wrap?: boolean;
  url?: string;
  boxed?: boolean;
  bgColor?: string;
}>();
</script>

<template>
  <div
    class="size-20 rounded-3xl shrink-0 self-center overflow-hidden transition-all"
    :class="{
      'p-2.5  ': !wrap,
      'bg-neutral-700/80 border shadow-xl': boxed,
    }"
    :style="`background-color: ${bgColor};`"
  >
    <img
      class="block h-full w-full rounded-lg"
      :src="url"
    />
  </div>
</template>
