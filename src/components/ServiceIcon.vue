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
    class="size-16 rounded-2xl shrink-0 self-center overflow-hidden transition-all"
    :class="{
      'p-2.5  ': !wrap,
      'bg-neutral-700/80 shadow-xl': boxed,
    }"
    :style="`background-color: ${bgColor};`"
  >
    <img
      v-if="url"
      class="block h-full w-full rounded-lg"
      :src="url"
    />
    <div
      v-else
      class="grid place-content-center h-full"
    >
      <slot>X</slot>
    </div>
  </div>
</template>
