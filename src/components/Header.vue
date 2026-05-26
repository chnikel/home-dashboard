<script setup lang="ts">
import PageContent from "./PageContent.vue";
import Button from "./ui/button/Button.vue";

const navigationRoutes = [
  {
    text: "Home",
    to: "/",
  },
  {
    text: "Apps",
    to: "apps",
  },
];
</script>

<template>
  <div class="border-b">
    <PageContent
      class="p-4 grid grid-cols-2 gap-2 shadow-lg justify-between min-h-[70px]"
    >
      <RouterLink
        to="/"
        class="items-center flex"
      >
        HomeLinker
      </RouterLink>

      <div class="space-x-2 justify-self-end">
        <RouterLink
          v-for="route in navigationRoutes"
          :to="route.to"
          v-slot="{ isActive }"
        >
          <Button
            variant="ghost"
            :class="{
              underline: isActive,
            }"
          >
            {{ route.text }}
          </Button>
        </RouterLink>
      </div>
    </PageContent>
  </div>
</template>
