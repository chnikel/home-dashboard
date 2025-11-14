<script setup lang="ts">
import { EyeOffIcon } from "lucide-vue-next";
import type { ServiceTag } from "../api";
import ServiceInfoIcon from "./ServiceInfoIcon.vue";
import { computed } from "vue";
import { store } from "@/store";
import {
  CloudOffIcon,
  ConstructionIcon,
  HardDriveIcon,
  RadioIcon,
} from "lucide-vue-next";

const props = defineProps<{
  id: number;
  title: string;
  description: string;
  link: string;
  icon_url: string;
  icon_wrap: boolean;
  tags: ServiceTag[];
  isEnabled?: boolean;
  bgColor?: string;
}>();

const isReachable = computed(() => {
  if (store.servicePings.length === 0) {
    return true;
  }

  const pingData = store.servicePings.find(
    (ping) => ping.serviceId == props.id
  );

  if (!pingData) {
    return false;
  }

  return pingData.isReachable;
});

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
  if (!isReachable) {
    return preConfiguredIcons["disconnected"];
  }
  const deprecated =
    props.tags.findIndex((t) => t.name.toLowerCase() == "deprecated") != -1;
  if (deprecated) {
    return preConfiguredIcons["deprecated"];
  }
  const showLive =
    props.tags.findIndex((t) => t.name.toLowerCase() == "live") != -1;
  if (showLive) {
    return preConfiguredIcons["live"];
  }
  return null;
});

const showPhysicalIndicator = computed(() => {
  return props.tags.findIndex((t) => t.name.toLowerCase() == "physical") != -1;
});
</script>

<template>
  <div class="relative">
    <div
      v-if="!isReachable"
      class="absolute inset-0 flex flex-col justify-center items-center bg-neutral-900/80 rounded-2xl z-[9]"
    >
      <CloudOffIcon color="white" />
      <span> Offline </span>
    </div>
    <div
      v-else-if="!isEnabled"
      class="absolute inset-0 flex justify-center items-center bg-neutral-900/80 rounded-2xl z-[9]"
    >
      <EyeOffIcon />
    </div>
    <a
      :href="link"
      target="_blank"
      class="flex flex-col justify-center p-5 overflow-hidden hover:bg-neutral-100/5 rounded-2xl"
    >
      <ServiceInfoIcon
        position="top-center"
        :show="selected !== null"
        :component="selected?.component"
        :colorClass="selected?.colorClass"
      />
      <div
        class="bg-accent size-16 shadow-xl rounded-2xl flex justify-center items-center mx-auto relative"
      >
        <ServiceInfoIcon
          class="z-[8]"
          position="bottom-right-out"
          :show="showPhysicalIndicator"
          :component="preConfiguredIcons['device'].component"
          :colorClass="preConfiguredIcons['device'].colorClass"
        />
        <div
          class="size-11 rounded-lg overflow-hidden p-1"
          :style="`background-color: ${bgColor};`"
        >
          <img
            class="w-full h-full"
            :src="icon_url"
          />
        </div>
      </div>
      <div class="text-center mt-2 text-sm">
        {{ title }}
      </div>
    </a>
  </div>
</template>
