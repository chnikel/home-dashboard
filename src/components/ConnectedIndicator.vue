<script setup lang="ts">
import { useConnectionStatus } from "@/composables/connection-status";
import { useLocalStorage } from "@vueuse/core";
import { CloudIcon, CloudOff } from "lucide-vue-next";
import { onMounted } from "vue";

const { status, start, stop } = useConnectionStatus();

const isEnabled = useLocalStorage("setting.app.backendConnectionTest", true);

const toggle = () => {
  if (isEnabled.value) {
    stop();
  } else {
    start();
  }

  isEnabled.value = !isEnabled.value;
};

onMounted(() => {
  if (isEnabled) {
    start();
  }
});
</script>

<template>
  <div @click="toggle()">
    <CloudIcon
      v-if="isEnabled"
      :size="18"
      :class="{
        'text-orange-500': status === 'connecting',
        'text-red-500': status === 'offline',
        'text-green-500': status === 'online',
      }"
    />
    <CloudOff
      v-else
      :size="18"
      class="text-neutral-500"
    />
  </div>
</template>
