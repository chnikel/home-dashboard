<script setup lang="ts">
import ConnectedIndicator from "./Connectedindicator.vue";
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
    <PageContent class="p-4 flex gap-2 shadow-lg min-h-[70px]">
      <RouterLink
        to="/"
        class="items-center flex"
      >
        HomeLinker
      </RouterLink>

      <ConnectedIndicator />

      <div class="ml-auto space-x-2 justify-self-end">
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
