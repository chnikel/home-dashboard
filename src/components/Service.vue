<script setup lang="ts">
import type { ServiceTag } from "../api";
import ServiceIcon from "./ServiceIcon.vue";
import ServiceTags from "./ServiceTags.vue";
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
    (ping) => ping.serviceId == props.id
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
      class="hover:bg-neutral-800 p-5 rounded-xl flex items-center justify-center flex-col"
    >
      <div
        v-if="!isEnabled"
        class="absolute inset-0 flex justify-center items-center bg-neutral-900/80 rounded-2xl z-[9]"
      >
        <EyeOffIcon />
      </div>

      <div class="relative">
        <ServiceIcon
          :class="{
            'outline-3 outline-red-500': !isReachable,
          }"
          style="grid-area: icon"
          :wrap="icon_wrap"
          :url="icon_url"
          :boxed="true"
          :bg-color="bgColor"
        />

        <ServiceInfoIcon
          class="z-[8]"
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

      <p
        style="grid-area: title"
        class="flex gap-2 items-center mt-2 overflow-hidden text-center text-sm"
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
