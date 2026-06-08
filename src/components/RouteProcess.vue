<script setup lang="ts">
import { useRouteProgress } from "@/composables/route-progress";

const { progress } = useRouteProgress();
</script>

<template>
  <div
    v-if="progress > 0"
    class="absolute z-50 top-0 left-0 right-0 pointer-events-none"
  >
    <div
      class="bg-red-500 h-1 transition-all duration-1000"
      :style="`width: ${progress}%`"
    ></div>
  </div>
</template>
