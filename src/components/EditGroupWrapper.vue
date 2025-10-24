<script setup lang="ts">
import { inject } from "vue";
import Button from "./ui/button/Button.vue";

defineProps<{ edit: boolean }>();

const editable = inject("editable");
const deletable = inject("deletable");

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "delete"): void;
}>();
</script>

<template>
  <div
    class="relative group"
    :class="{
      'outline outline-gray-500 outline-dashed rounded-2xl': edit,
    }"
  >
    <div
      v-if="edit"
      class="absolute inset-0 hidden group-hover:block bg-neutral-500/30 rounded-2xl space-x-1"
    >
      <div class="flex gap-3 justify-center items-center h-full">
        <Button
          v-if="editable"
          data-variant="outline"
          @click="emit('edit')"
        >
          Bearbeiten
        </Button>
        <Button
          v-if="deletable"
          variant="destructive"
          @click="emit('delete')"
        >
          Löschen
        </Button>
      </div>
    </div>

    <slot />
  </div>
</template>
