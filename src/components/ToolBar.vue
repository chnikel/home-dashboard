<script setup lang="ts">
import PageContent from "./PageContent.vue";

defineProps<{
  contentClass?: string;
}>();
</script>

<template>
  <div class="border-b">
    <PageContent
      class="p-4 grid gap-2 items-center"
      :class="contentClass"
    >
      <slot />
    </PageContent>
  </div>
</template>
