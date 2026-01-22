<script setup lang="ts">
import type { ServiceTag } from "../api";
import { computed } from "vue";
import { store } from "@/store";
import {
  EyeOffIcon,
  FlaskConicalIcon,
  HardDriveIcon,
  ShieldCheckIcon,
  UnplugIcon,
} from "lucide-vue-next";
import ServiceTags from "./ServiceTags.vue";
import { cn } from "@/lib/utils";

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

const hasTag = (tag: string) =>
  props.tags.findIndex((t) => t.name.toLowerCase() == tag) !== -1;

const titleIndicators = [
  {
    when: hasTag("test") || hasTag("testen"),
    class: "text-yellow-500",
    icon: FlaskConicalIcon,
  },
  {
    when: props.link?.startsWith("https://"),
    class: "text-emerald-500",
    icon: ShieldCheckIcon,
  },
];

const imageIndicators = [
  {
    when: hasTag("physical"),
    class: "bg-neutral-900",
    icon: HardDriveIcon,
  },
];
</script>

<template>
  <a
    :href="link || '#'"
    :target="link && '_blank'"
    class="block relative"
  >
    <div
      class="border border-neutral-700 bg-neutral-800 rounded-lg grid grid-rows-[120px_auto_auto] overflow-hidden"
      :class="{
        'outline-3 outline-red-500': !isReachable,
      }"
    >
      <div
        class="absolute inset-0 justify-center items-center bg-neutral-900/50 rounded-lg z-[9] hidden group-hover:flex pointer-events-none"
      ></div>
      <div
        v-if="!isEnabled"
        class="absolute inset-0 flex justify-center items-center bg-neutral-900/80 rounded-lg z-[9]"
      >
        <EyeOffIcon />
      </div>

      <div
        class="relative flex justify-center items-center border-b border-solid border-inherit rounded-t-lg"
        :style="`background-color: ${bgColor};`"
      >
        <img
          class="size-16"
          :src="icon_url"
        />

        <div class="absolute top-0 left-0 m-2 rounded-lg flex gap-1">
          <div
            v-if="!isReachable"
            class="rounded-lg p-1.5 bg-red-600"
          >
            <UnplugIcon :size="16" />
          </div>
        </div>

        <div class="absolute bottom-0 right-0 m-2 rounded-lg flex gap-1">
          <template v-for="indicator in imageIndicators">
            <div
              v-if="indicator.when"
              :class="cn('rounded-lg p-1.5 ', indicator.class)"
            >
              <component
                :is="indicator.icon"
                :size="16"
              ></component>
            </div>
          </template>
        </div>
      </div>

      <div class="overflow-hidden m-2">
        <div
          class="text-blue-300 text-sm text-nowrap overflow-ellipsis overflow-hidden"
        >
          <div class="grid grid-cols-[1fr_auto] items-center gap-1">
            <div class="overflow-ellipsis overflow-hidden">
              {{ title }}
            </div>
            <div class="justify-end flex shrink-0 gap-0.5">
              <template v-for="indicator in titleIndicators">
                <component
                  v-if="indicator.when"
                  :is="indicator.icon"
                  :size="16"
                  :class="indicator.class"
                ></component>
              </template>
            </div>
          </div>
        </div>

        <div
          v-if="description.trim()"
          class="flex items-center mt-1"
        >
          <div
            class="text-sm text-neutral-300 text-nowrap overflow-ellipsis overflow-hidden"
          >
            {{ description }}
          </div>
        </div>
      </div>
      <div
        class="border-t p-2 border-solid border-inherit flex overflow-hidden"
        v-if="tags.length > 0"
      >
        <ServiceTags
          class="flex overflow-auto"
          style="scrollbar-width: none"
          :tags="tags"
          :max="2"
        />
      </div>
    </div>
  </a>
</template>
