<script setup lang="ts">
import { preConfiguredIcons } from "@/lib/status-icons";
import { store } from "@/store";
import {
  AppWindowIcon,
  EyeOffIcon,
  FlaskConicalIcon,
  ShieldCheckIcon,
  ShieldOffIcon,
  ShieldQuestionMarkIcon,
} from "lucide-vue-next";
import { computed } from "vue";
import type { GetServicesResponse } from "../api";
import ServiceIcon from "./ServiceIcon.vue";
import ServiceInfoIcon from "./ServiceInfoIcon.vue";

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

const hasTag = (tag: string) =>
  props.data.tags.findIndex((t) => t.name.toLowerCase() == tag) !== -1;

const isHttps = props.data.link?.startsWith("https://") || false;
const isHttp = props.data.link?.startsWith("http://") || false;

const titleIndicators = [
  {
    when: hasTag("test") || hasTag("testen"),
    class: "text-yellow-500",
    icon: FlaskConicalIcon,
  },
  {
    when: isHttps,
    class: "text-emerald-500",
    icon: ShieldCheckIcon,
  },
  {
    when: isHttp,
    class: "text-orange-500",
    icon: ShieldOffIcon,
  },
  {
    when: !isHttps && !isHttp,
    class: "text-red-500",
    icon: ShieldQuestionMarkIcon,
  },
];
</script>

<template>
  <a
    :href="data.link || '#'"
    :target="data.link && '_blank'"
    class="relative grid grid-cols-[16px_auto_16px] pt-4 pb-2 gap-y-2 hover:bg-neutral-800 rounded-xl border"
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
    <div class="relative col-start-2 col-end-3">
      <ServiceIcon
        class="mx-auto"
        :wrap="data.icon_wrap"
        :url="data.icon_url"
        :boxed="true"
        :bg-color="data.bgColor"
      >
        <AppWindowIcon />
      </ServiceIcon>

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

    <div class="col-start-3 flex flex-col gap-1">
      <template v-for="indicator in titleIndicators">
        <component
          v-if="indicator.when"
          :is="indicator.icon"
          :size="16"
          :class="indicator.class"
        ></component>
      </template>
    </div>

    <p class="col-span-3 overflow-hidden text-center text-xs min-h-8">
      {{ data.title }}
    </p>
  </a>
</template>
