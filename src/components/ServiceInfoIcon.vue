<script setup lang="ts">
import { cn } from "@/lib/utils";
import {
  CloudOffIcon,
  ConstructionIcon,
  HardDriveIcon,
  RadioIcon,
} from "lucide-vue-next";
import { computed } from "vue";

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const props = defineProps<{
  showLiveIcon?: boolean;
  showDeprecatedIcon?: boolean;
  showDeviceIcon?: boolean;
  showDisconnectedIcon?: boolean;
  position?: Position;
}>();

const preConfiguredIcons = {
  disconnected: {
    component: CloudOffIcon,
    colorClass: "bg-red-600",
  },
  live: {
    component: RadioIcon,
    colorClass: "bg-red-800",
  },
  deprecated: {
    component: ConstructionIcon,
    colorClass: "bg-blue-800/50",
  },
  device: {
    component: HardDriveIcon,
    colorClass: "bg-neutral-800",
  },
};

const selected = computed(() => {
  if (props.showDisconnectedIcon) {
    return preConfiguredIcons["disconnected"];
  }
  if (props.showDeviceIcon) {
    return preConfiguredIcons["device"];
  }
  if (props.showDeprecatedIcon) {
    return preConfiguredIcons["deprecated"];
  }
  if (props.showLiveIcon) {
    return preConfiguredIcons["live"];
  }
});

const position = computed(() => {
  switch (props.position) {
    case "top-right":
      return "top-0 right-0 rounded-tr-xl rounded-bl-xl";

    case "bottom-right":
      return "bottom-0 right-0 rounded-tl-xl rounded-br-xl";

    case "bottom-left":
      return "bottom-0 left-0 rounded-tr-xl rounded-bl-xl";

    case "top-left":
    default:
      return "top-0 left-0 rounded-tl-xl rounded-br-xl";
  }
});
</script>

<template>
  <div
    v-if="selected"
    class="absolute rounded p-1.5"
    :class="cn(selected.colorClass, position)"
  >
    <component
      :is="selected.component"
      :size="16"
    ></component>
  </div>
</template>
