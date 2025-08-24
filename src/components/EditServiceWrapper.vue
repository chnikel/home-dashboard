<script setup lang="ts">
const props = defineProps<{ id: number; edit: boolean }>();

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "delete"): void;
}>();

const onDragStart = (event: DragEvent) => {
  event.dataTransfer?.setData("text/plain", props.id.toString());
};
</script>

<template>
  <div
    @dragstart="onDragStart($event)"
    class="relative group border"
    :class="{
      'border-orange-500 rounded-2xl': edit,
      'border-transparent': !edit,
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
