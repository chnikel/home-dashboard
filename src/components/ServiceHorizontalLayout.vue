<script setup lang="ts">
import { preConfiguredIcons } from "@/lib/status-icons";
import { store } from "@/store";
import {
  AppWindowIcon,
  EyeOffIcon,
  FlaskConicalIcon,
  HardDriveIcon,
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
    when: showPhysicalIndicator.value,
    class: "",
    icon: HardDriveIcon,
  },
];
const descriptionIndicators = [
  {
    when: hasTag("test") || hasTag("testen"),
    class: "text-yellow-500",
    icon: FlaskConicalIcon,
  },
];
const urlSecureIndicator = [
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
    class="relative flex gap-3 hover:bg-neutral-800 rounded-2xl border"
    :class="{
      'outline-2 outline-red-500': !isReachable,
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
    >
      <ServiceInfoIcon
        class="z-10"
        position="top-left-out"
        :show="true"
        :component="preConfiguredIcons['disconnected'].component"
        :colorClass="preConfiguredIcons['disconnected'].colorClass"
      />
    </div>

    <ServiceInfoIcon
      class="z-10"
      position="top-left-out"
      :show="isPinned"
      :component="preConfiguredIcons['pinned'].component"
      :colorClass="preConfiguredIcons['pinned'].colorClass"
    />

    <ServiceIcon
      :wrap="data.icon_wrap"
      :url="data.icon_url"
      :boxed="true"
      :bg-color="data.bgColor"
    >
      <AppWindowIcon />
    </ServiceIcon>

    <div class="flex flex-col justify-center grow">
      <p class="overflow-hidden flex gap-1 items-center">
        <template v-for="indicator in titleIndicators">
          <component
            v-if="indicator.when"
            :is="indicator.icon"
            :size="16"
            :class="indicator.class"
          ></component>
        </template>
        {{ data.title }}
      </p>
      <div class="flex gap-0.5">
        <template v-for="indicator in descriptionIndicators">
          <component
            v-if="indicator.when"
            :is="indicator.icon"
            :size="16"
            :class="indicator.class"
          ></component>
        </template>
      </div>
    </div>

    <div class="flex items-center p-3">
      <template v-for="indicator in urlSecureIndicator">
        <component
          v-if="indicator.when"
          :is="indicator.icon"
          :size="16"
          :class="indicator.class"
        ></component>
      </template>
    </div>
  </a>
</template>
