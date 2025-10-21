<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { PenIcon, Trash2Icon } from "lucide-vue-next";

defineProps<{
  isEnabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "delete"): void;
}>();
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger>
      <slot />
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem @click="emit('edit')">
        <PenIcon /> Bearbeiten
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem
        variant="destructive"
        @click="emit('delete')"
      >
        <Trash2Icon /> Löschen
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
