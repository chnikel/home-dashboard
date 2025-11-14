<script setup lang="ts">
import { cn } from "@/lib/utils";
import { computed } from "vue";

type PositionVertical = "top" | "bottom" | "center";
type PositionHorizontal = "left" | "right" | "center";
type Position = `${PositionVertical}-${PositionHorizontal}`;
type PositionOutside = `${PositionVertical}-${PositionHorizontal}-out`;

const props = defineProps<{
  position?: Position | PositionOutside;
  component?: any;
  colorClass?: string;
  show?: boolean;
}>();

const position = computed(() => {
  switch (props.position) {
    case "bottom-right":
      return "bottom-0 right-0 rounded-xl rounded-br-xl";

    case "bottom-right-out":
      return "bottom-0 right-0 rounded-xl rounded-br-xl translate-x-1/3 translate-y-1/3";

    case "bottom-center":
      return "bottom-0 left-1/2 -translate-x-1/2 rounded-t-xl";

    case "bottom-left":
      return "bottom-0 left-0 rounded-tr-xl rounded-bl-xl";

    case "top-right":
      return "top-0 right-0 rounded-tr-xl rounded-bl-xl";

    case "center-center":
      return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl";

    case "top-center":
      return "top-0 left-1/2 -translate-x-1/2 rounded-b-xl";

    case "top-left":
    default:
      return "top-0 left-0 rounded-tl-xl rounded-br-xl";
  }
});
</script>

<template>
  <div
    v-if="show"
    class="absolute rounded p-1.5 shadow-2xl z-10"
    :class="cn(colorClass, position)"
  >
    <component
      :is="component"
      :size="16"
    ></component>
  </div>
</template>
