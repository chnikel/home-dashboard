<script setup lang="ts">
import PageContent from "@/components/PageContent.vue";
import Button from "@/components/ui/button/Button.vue";
import type { RouteLocationRaw } from "vue-router";

defineProps<{
  title: string;
  description?: string;
  primaryActionText: string;
  primaryAction: RouteLocationRaw
}>();
</script>

<template>
  <PageContent class="relative flex items-center justify-center">
    <div class="flex flex-col items-center gap-3">
      <div class="text-center">
        <h3 class="text-lg font-bold">{{ title }}</h3>
        <p
          v-if="description"
          class="text-neutral-500"
        >
          {{ description }}
        </p>
      </div>

      <RouterLink :to="primaryAction">
        <Button variant="default"> {{ primaryActionText }} </Button>
      </RouterLink>
    </div>
  </PageContent>
</template>
