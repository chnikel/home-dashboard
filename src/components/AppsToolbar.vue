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
import ToolBar from "./ToolBar.vue";

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
  <ToolBar content-class="grid-cols-2 sm:grid-cols-3">
    <div class="justify-self-start shrink-0">
      <Badge variant="outline">
        {{ totalCount }}
      </Badge>
      Services
    </div>

    <ButtonGroup
      class="overflow-scroll [scrollbar-width:none] justify-self-end sm:justify-self-center"
      v-if="savedTabs.length > 0"
    >
      <ContextMenu v-for="savedTab in savedTabs">
        <ContextMenuTrigger>
          <Button
            class="cursor-pointer"
            :variant="searchText === savedTab.text ? 'default' : 'outline'"
            @click="emit('saveSearch', savedTab.text)"
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

    <div
      class="col-start-2 justify-self-end sm:justify-self-end sm:col-start-auto"
    >
      <slot name="end"></slot>
    </div>
  </ToolBar>
</template>
