<script setup lang="ts">
import type { ServiceTag } from "../api";
import ServiceInfoIcon from "./ServiceInfoIcon.vue";
import { computed } from "vue";
import { store } from "@/store";
import ServiceTags from "./ServiceTags.vue";
import { preConfiguredIcons } from "@/lib/status-icons";

const props = defineProps<{
  id: number;
  title: string;
  description: string;
  link?: string;
  icon_url: string;
  icon_wrap: boolean;
  tags: ServiceTag[];
  bgColor?: string;
}>();

const isReachable = computed(() => {
  if (store.servicePings.length === 0 || !props.link) {
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
    <a
      :href="link || '#'"
      :target="link && '_blank'"
      class="flex flex-col justify-center p-5 overflow-hidden hover:bg-neutral-100/5 rounded-2xl"
    >
      <ServiceInfoIcon
        class="z-[8]"
        position="top-right"
        :show="!isReachable"
        :component="preConfiguredIcons['disconnected'].component"
        :colorClass="preConfiguredIcons['disconnected'].colorClass"
      />
      
      <ServiceInfoIcon
        class="z-[8]"
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

      <ServiceTags
        class="mt-1 mx-auto"
        :tags="tags"
        :max="2"
      />
    </a>
  </div>
</template>
