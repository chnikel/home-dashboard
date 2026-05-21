<script setup lang="ts">
import type { SavedTab } from "@/composables/saved-search";
import Badge from "./ui/badge/Badge.vue";
import ButtonGroup from "./ui/button-group/ButtonGroup.vue";
import ContextMenu from "./ui/context-menu/ContextMenu.vue";
import ContextMenuTrigger from "./ui/context-menu/ContextMenuTrigger.vue";
import Button from "./ui/button/Button.vue";
import ContextMenuContent from "./ui/context-menu/ContextMenuContent.vue";
import ContextMenuItem from "./ui/context-menu/ContextMenuItem.vue";
import { XIcon } from "lucide-vue-next";
import LayoutSwitcher from "./LayoutSwitcher.vue";

const compactMode = defineModel("compactMode");

defineProps<{
  totalCount: number;
  savedTabs: SavedTab[];
  searchText: string;
}>();

const emit = defineEmits<{
  (e: "saveSearch", value: string): void;
  (e: "removeSearch", value: string): void;
}>();
</script>

<template>
  <div
    class="container mx-auto max-w-6xl p-4 flex justify-between items-center gap-2"
  >
    <div class="shrink-0">
      <Badge variant="outline">
        {{ totalCount }}
      </Badge>
      Services
    </div>
    <ButtonGroup
      class="overflow-scroll [scrollbar-width:none] justify-self-center"
      v-if="savedTabs.length > 0"
    >
      <ContextMenu v-for="savedTab in savedTabs">
        <ContextMenuTrigger>
          <Button
            class="cursor-pointer"
            variant="outline"
            @click="emit('saveSearch', savedTab.text)"
            :class="{
              '!bg-accent': searchText === savedTab.text,
            }"
          >
            {{ savedTab.text }}
          </Button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            variant="destructive"
            @click="emit('removeSearch', savedTab.text)"
          >
            <XIcon /> Löschen
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </ButtonGroup>
    <LayoutSwitcher v-model="compactMode" />
  </div>
</template>
