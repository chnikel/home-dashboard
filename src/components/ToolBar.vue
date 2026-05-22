<script setup lang="ts">
import PageContent from "./PageContent.vue";
</script>

<template>
  <div class="border-b">
    <PageContent class="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 items-center">
      <div class="justify-self-start">
        <slot name="start"></slot>
      </div>
      <div class="justify-self-end sm:justify-self-center">
        <slot name="center"></slot>
      </div>
      <div class="col-start-2 justify-self-end sm:justify-self-end sm:col-start-auto">
        <slot name="end"></slot>
      </div>
    </PageContent>
  </div>
</template>
