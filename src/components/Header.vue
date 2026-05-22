<script setup lang="ts">
import PageContent from "./PageContent.vue";
</script>

<template>
  <div class="border-b">
    <PageContent
      class="p-4 grid grid-cols-2 sm:grid-cols-[1fr_3fr_1fr] gap-2 shadow-lg justify-between min-h-[70px]"
    >
      <RouterLink
        to="/"
        class="items-center flex"
      >
        HomeLinker
      </RouterLink>

      <div class="flex gap-1 sm:justify-self-center">
        <slot name="center"></slot>
      </div>

      <div class="space-x-2 justify-self-end">
        <slot name="end"></slot>
      </div>
    </PageContent>
  </div>
</template>
