<script setup lang="ts">
defineProps<{ edit: boolean }>();

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "delete"): void;
}>();
</script>

<template>
  <div
    class="relative group"
    :class="{
      'outline outline-orange-500 rounded-2xl': edit,
    }"
  >
    <div
      v-if="edit"
      class="absolute inset-0 hidden group-hover:block bg-neutral-500/30 rounded-2xl space-x-1"
    >
      <div class="flex gap-3 justify-center items-center h-full">
        <button
          data-variant="outline"
          @click="emit('edit')"
        >
          Bearbeiten
        </button>
        <button
          data-type="danger"
          @click="emit('delete')"
        >
          Löschen
        </button>
      </div>
    </div>
    <slot />
  </div>
</template>
