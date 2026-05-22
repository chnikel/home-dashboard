<script setup lang="ts">
import PageContent from "./PageContent.vue";
</script>

<template>
  <PageContent class="p-4 flex justify-between items-center gap-2">
    <slot />
  </PageContent>
</template>
