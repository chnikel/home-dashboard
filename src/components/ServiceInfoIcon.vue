<script setup lang="ts">
import { ConstructionIcon, HardDriveIcon, RadioIcon } from "lucide-vue-next";

defineProps<{
  showLiveIcon?: boolean;
  showDeprecatedIcon?: boolean;
  showDeviceIcon?: boolean;
}>();
</script>

<template>
  <div
    v-if="showLiveIcon"
    class="absolute left-0 top-0 bg-red-800 rounded rounded-tl-xl rounded-br-xl p-1.5"
  >
    <RadioIcon :size="16" />
  </div>
  <div
    v-else-if="showDeprecatedIcon"
    class="absolute left-0 top-0 bg-yellow-800 rounded rounded-tl-xl rounded-br-xl p-1.5"
  >
    <ConstructionIcon :size="16" />
  </div>
    <div
    v-else-if="showDeviceIcon"
    class="absolute left-0 top-0 bg-neutral-800 rounded rounded-tl-xl rounded-br-xl p-1.5"
  >
    <HardDriveIcon :size="16" />
  </div>
</template>
