<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { EyeIcon, EyeOffIcon, PenIcon, Trash2Icon } from "lucide-vue-next";
import ContextMenuCheckboxItem from "./ui/context-menu/ContextMenuCheckboxItem.vue";
import { tagsSortedByWeight } from "@/store";
import Tag from "./Tag.vue";
import ContextMenuSub from "./ui/context-menu/ContextMenuSub.vue";
import ContextMenuSubTrigger from "./ui/context-menu/ContextMenuSubTrigger.vue";
import ContextMenuSubContent from "./ui/context-menu/ContextMenuSubContent.vue";

defineProps<{
  isEnabled?: boolean;
  tags: string[];
}>();

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "toggleVisibility"): void;
  (e: "delete"): void;
  (e: "toggleTag", tagId: number): void;
}>();

const sortedTags = tagsSortedByWeight();
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
      <ContextMenuItem @click="emit('toggleVisibility')">
        <template v-if="isEnabled"> <EyeOffIcon /> Verstecken </template>
        <template v-else> <EyeIcon /> Anzeigen </template>
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuSub>
        <ContextMenuSubTrigger inset> Tags </ContextMenuSubTrigger>
        <ContextMenuSubContent class="w-48">
          <ContextMenuCheckboxItem
            v-for="tag in sortedTags"
            :model-value="tags.includes(tag.name)"
            @click="emit('toggleTag', tag.id)"
          >
            <Tag
              :name="tag.name"
              :color="tag.color"
            />
          </ContextMenuCheckboxItem>
        </ContextMenuSubContent>
      </ContextMenuSub>

      <ContextMenuItem
        variant="destructive"
        @click="emit('delete')"
      >
        <Trash2Icon /> Löschen</ContextMenuItem
      >
    </ContextMenuContent>
  </ContextMenu>
</template>
