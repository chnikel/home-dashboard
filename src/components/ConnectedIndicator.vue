<script setup lang="ts">
import { useConnectionStatus } from "@/composables/connection-status";
import { CloudIcon, CloudOff } from "lucide-vue-next";
import { ref } from "vue";

const { status, start, stop } = useConnectionStatus();

const isEnabled = ref(true);

const toggle = () => {
  if (isEnabled.value) {
    stop()
  } else {
    start()
  }

  isEnabled.value = !isEnabled.value;
};
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
