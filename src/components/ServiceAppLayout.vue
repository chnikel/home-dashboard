<script setup lang="ts">
import type { ServiceTag } from "../api";
import ServiceIcon from "./ServiceIcon.vue";
import ServiceInfoIcon from "./ServiceInfoIcon.vue";
import { computed } from "vue";
import { store } from "@/store";
import { preConfiguredIcons } from "@/lib/status-icons";
import { EyeOffIcon } from "lucide-vue-next";

const props = defineProps<{
  id: number;
  title: string;
  description: string;
  link?: string;
  icon_url: string;
  icon_wrap: boolean;
  tags: ServiceTag[];
  isEnabled?: boolean;
  showTags?: boolean;
  bgColor?: string;
}>();

const isReachable = computed(() => {
  if (store.servicePings.length === 0 || !props.link) {
    return true;
  }

  const pingData = store.servicePings.find(
    (ping) => ping.serviceId == props.id,
  );

  if (!pingData) {
    return false;
  }

  return pingData.isReachable;
});

const showPhysicalIndicator = computed(() => {
  return props.tags.findIndex((t) => t.name.toLowerCase() == "physical") != -1;
});
</script>

<template>
  <a
    :href="link || '#'"
    :target="link && '_blank'"
    class="block relative h-full hover:bg-neutral-800 p-4 pt-4 pb-2 rounded-xl border bg-neutral-800/30"
    :class="{
      'outline-2 outline-red-500': !isReachable,
    }"
  >
    <div
      v-if="!isEnabled"
      class="absolute inset-0 flex justify-center items-center bg-neutral-900/80 rounded-2xl z-[9]"
    >
      <EyeOffIcon />
    </div>

    <div
      v-if="!isReachable"
      class="absolute inset-0 flex justify-center items-center bg-neutral-900/50 z-[9] rounded-2xl"
    ></div>

    <div class="relative">
      <ServiceIcon
        class="mx-auto"
        :wrap="icon_wrap"
        :url="icon_url"
        :boxed="true"
        :bg-color="bgColor"
      />

      <ServiceInfoIcon
        class="z-10"
        position="top-left-out"
        :show="!isReachable"
        :component="preConfiguredIcons['disconnected'].component"
        :colorClass="preConfiguredIcons['disconnected'].colorClass"
      />

      <ServiceInfoIcon
        class="z-[8]"
        position="bottom-right-out"
        :show="showPhysicalIndicator"
        :component="preConfiguredIcons['device'].component"
        :colorClass="preConfiguredIcons['device'].colorClass"
      />
    </div>

    <p class="mt-2 overflow-hidden text-center text-xs min-h-8">
      {{ title }}
    </p>
  </a>
</template>
