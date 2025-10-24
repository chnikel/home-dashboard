<script setup lang="ts">
defineProps<{
  wrap?: boolean;
  url?: string;
  boxed?: boolean;
}>();
</script>

<template>
  <div
    class="w-16 h-16 rounded-2xl shrink-0 self-center overflow-hidden transition-all"
    :class="{
      'p-2  ': !wrap,
      'bg-neutral-700/80 border border-neutral-600': boxed,
    }"
  >
    <img
      class="block h-full w-full"
      :src="`http://localhost:3000${url}`"
    />
  </div>
</template>
