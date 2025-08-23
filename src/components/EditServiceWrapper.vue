<script setup lang="ts">
defineProps<{ edit: boolean }>();

const emit = defineEmits<{
  (e: "edit"): void;
}>();
</script>

<template>
  <div class="relative hover:bg-stone-300/5">
    <div
      v-if="edit"
      class="absolute inset-0"
    >
      <button @click="emit('edit')">Edit</button>
    </div>
    <slot />
  </div>
</template>
