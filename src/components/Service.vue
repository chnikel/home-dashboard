<script setup lang="ts">
import type { ServiceTag } from "../api";
import ServiceInfoIcon from "./ServiceInfoIcon.vue";
import { computed } from "vue";
import { store } from "@/store";
import { preConfiguredIcons } from "@/lib/status-icons";
import {
  BubblesIcon,
  EyeOffIcon,
  MessageSquareIcon,
  MessageSquareTextIcon,
  TextIcon,
} from "lucide-vue-next";
import Tag from "./Tag.vue";

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
    class="block relative"
  >
    <div
      class="border border-neutral-700 bg-neutral-800 rounded-lg grid grid-rows-[100px_auto_auto] overflow-hidden"
    >
      <div
        v-if="!isEnabled"
        class="absolute inset-0 flex justify-center items-center bg-neutral-900/80 rounded-lg z-[9]"
      >
        <EyeOffIcon />
      </div>

      <div
        class="relative flex justify-center items-center border-b border-solid border-neutral-700 rounded-t-lg"
        :style="`background-color: ${bgColor};`"
      >
        <img
          class="size-16"
          :src="icon_url"
        />

        <ServiceInfoIcon
          class="z-[8] m-1"
          position="top-left"
          :show="!isReachable"
          :component="preConfiguredIcons['disconnected'].component"
          :colorClass="preConfiguredIcons['disconnected'].colorClass"
        />

        <ServiceInfoIcon
          class="z-[8] m-1"
          position="bottom-right"
          :show="showPhysicalIndicator"
          :component="preConfiguredIcons['device'].component"
          :colorClass="preConfiguredIcons['device'].colorClass"
        />
      </div>

      <div class="overflow-hidden m-2">
        <div
          class="text-blue-300 text-sm text-nowrap overflow-ellipsis overflow-hidden"
        >
          {{ title }}
        </div>

        <div class="flex items-center gap-1">
          <MessageSquareTextIcon
            :size="16"
            class="shrink-0 !text-neutral-300"
          />

          <div
            class="text-sm text-neutral-300 text-nowrap overflow-ellipsis overflow-hidden"
          >
            {{ description }}
          </div>
        </div>
      </div>
      <div
        class="border-t p-2 border-solid border-neutral-700 flex overflow-hidden"
      >
        <div
          class="flex overflow-auto"
          style="scrollbar-width: none"
        >
          <Tag
            v-for="tag in tags"
            :color="tag.color"
            :name="tag.name"
          />
        </div>
      </div>
    </div>
  </a>
</template>
