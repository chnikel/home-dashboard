<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { EyeIcon, EyeOffIcon, PenIcon, Trash2Icon } from "lucide-vue-next";

defineProps<{
  isEnabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "toggleVisibility"): void;
  (e: "delete"): void;
}>();
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger>
      <slot />
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem @click="emit('edit')"><PenIcon /> Edit</ContextMenuItem>
      <ContextMenuItem disabled>
        <template v-if="isEnabled"> <EyeOffIcon /> Disable </template>
        <template v-else> <EyeIcon /> Enable </template>
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem
        variant="destructive"
        @click="emit('delete')"
        > <Trash2Icon /> Delete</ContextMenuItem
      >
    </ContextMenuContent>
  </ContextMenu>
</template>
