<script setup lang="ts">
import { inject } from "vue";
import Button from "./ui/button/Button.vue";

defineProps<{
  edit: boolean;
  isCollapsed?: boolean;
}>();

const editable = inject("editable");
const deletable = inject("deletable");

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "delete"): void;
}>();
</script>

<template>
  <div class="relative group">
    <div
      v-if="edit"
      class="absolute inset-0 hidden group-hover:block bg-neutral-500/30 rounded-t-lg space-x-1 pointer-events-none"
      :class="{
        'rounded-b-lg': isCollapsed,
      }"
    >
      <div class="flex gap-3 justify-center items-center h-full">
        <Button
          v-if="editable"
          class="pointer-events-auto"
          data-variant="outline"
          @click="emit('edit')"
        >
          Bearbeiten
        </Button>
        <Button
          v-if="deletable"
          class="pointer-events-auto"
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
