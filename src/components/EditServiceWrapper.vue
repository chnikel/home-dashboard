<script setup lang="ts">
defineProps<{ edit: boolean }>();

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "delete"): void;
}>();
</script>

<template>
  <div class="relative hover:bg-neutral-300/5">
    <div
      v-if="edit"
      class="absolute inset-0"
    >
      <button @click="emit('edit')">Edit</button>
      <button @click="emit('delete')">Delete</button>
    </div>
    <slot />
  </div>
</template>
