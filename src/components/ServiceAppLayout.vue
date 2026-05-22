<script setup lang="ts">
import type { GetServicesResponse } from "../api";
import ServiceIcon from "./ServiceIcon.vue";
import ServiceInfoIcon from "./ServiceInfoIcon.vue";
import { computed } from "vue";
import { store } from "@/store";
import { preConfiguredIcons } from "@/lib/status-icons";
import { EyeOffIcon } from "lucide-vue-next";

const props = defineProps<{
  data: GetServicesResponse;
  isPinned?: boolean;
}>();

const isReachable = computed(() => {
  if (store.servicePings.length === 0 || !props.data.link) {
    return true;
  }

  const pingData = store.servicePings.find(
    (ping) => ping.serviceId == props.data.id,
  );

  if (!pingData) {
    return false;
  }

  return pingData.isReachable;
});

const showPhysicalIndicator = computed(() => {
  return (
    props.data.tags.findIndex((t) => t.name.toLowerCase() == "physical") != -1
  );
});
</script>

<template>
  <a
    :href="data.link || '#'"
    :target="data.link && '_blank'"
    class="block relative h-full hover:bg-neutral-800 p-4 pt-4 pb-2 rounded-xl border"
    :class="{
      'outline-2 outline-red-500': !isReachable,
      'outline-2 outline-blue-500': isPinned,
    }"
  >
    <div
      v-if="!data.enabled"
      class="absolute inset-0 flex justify-center items-center bg-neutral-900/80 rounded-2xl z-[9]"
    >
      <EyeOffIcon />
    </div>

    <div
      v-if="!isReachable"
      class="absolute inset-0 flex justify-center items-center bg-neutral-900/50 z-[9] rounded-2xl"
    ></div>
    <ServiceInfoIcon
      class="z-10"
      position="top-left"
      :show="isPinned"
      :component="preConfiguredIcons['pinned'].component"
      :colorClass="preConfiguredIcons['pinned'].colorClass"
    />
    <div class="relative">
      <ServiceIcon
        class="mx-auto"
        :wrap="data.icon_wrap"
        :url="data.icon_url"
        :boxed="true"
        :bg-color="data.bgColor"
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
      {{ data.title }}
    </p>
  </a>
</template>
