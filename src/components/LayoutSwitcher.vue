<script setup lang="ts">
import { LayoutGridIcon, LayoutListIcon } from "lucide-vue-next";
import ButtonGroup from "./ui/button-group/ButtonGroup.vue";
import Button from "./ui/button/Button.vue";
import { useLayoutMode } from "@/composables/layout-mode";

const { isCompact } = useLayoutMode();
</script>

<template>
  <ButtonGroup>
    <Button
      class="cursor-pointer"
      :variant="isCompact ? 'outline' : 'default'"
      size="icon"
      @click="isCompact = false"
    >
      <LayoutListIcon />
    </Button>
    <Button
      class="cursor-pointer"
      :variant="isCompact ? 'default' : 'outline'"
      size="icon"
      @click="isCompact = true"
    >
      <LayoutGridIcon />
    </Button>
  </ButtonGroup>
</template>
