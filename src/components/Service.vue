<script setup lang="ts">
import type { ServiceTag } from "../api";
import ServiceIcon from "./ServiceIcon.vue";
import ServiceTags from "./ServiceTags.vue";
import ServiceInfoIcon from "./ServiceInfoIcon.vue";
import { computed } from "vue";
import { store } from "@/store";
import { preConfiguredIcons } from "@/lib/status-icons";
import { UnplugIcon } from "lucide-vue-next";

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
  showIndicators?: boolean;
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
  <a
    :href="link || '#'"
    :target="link && '_blank'"
    class="w-40 block"
  >
    <div
      v-if="!isReachable"
      class="absolute z-10 inset-0 flex justify-center items-center bg-neutral-900/80 rounded-2xl border border-red-700"
    >
      <div class="rounded-lg p-1.5 shadow-2xl bg-neutral-700">
        <UnplugIcon />
      </div>
    </div>

    <div
      class="hover:bg-neutral-800 p-5 rounded-xl flex items-center justify-center flex-col"
    >
      <div class="relative">
        <ServiceIcon
          style="grid-area: icon"
          :wrap="icon_wrap"
          :url="icon_url"
          :boxed="true"
          :bg-color="bgColor"
        />

        <ServiceInfoIcon
          v-if="showIndicators"
          class="z-[8]"
          position="top-left"
          :show="selected !== null"
          :component="selected?.component"
          :colorClass="selected?.colorClass"
        />

        <ServiceInfoIcon
          v-if="showIndicators"
          class="z-[8]"
          position="bottom-left"
          :show="showPhysicalIndicator"
          :component="preConfiguredIcons['device'].component"
          :colorClass="preConfiguredIcons['device'].colorClass"
        />
      </div>

      <p
        style="grid-area: title"
        class="flex gap-2 items-center mt-2 overflow-hidden text-center"
      >
        {{ title }}
      </p>

      <ServiceTags
        v-if="showTags"
        class="mt-2"
        :tags="tags"
        :max="2"
      />
    </div>
  </a>
</template>

<style lang="css" scoped>
.layout-normal {
  grid-template-columns: auto 1fr;
  grid-template-areas:
    "icon title"
    "icon description"
    "icon tags";
}
</style>
