<script setup lang="ts">
import Header from "@/components/Header.vue";
import PageContent from "@/components/PageContent.vue";
import ServiceAppLayout from "@/components/ServiceAppLayout.vue";
import Button from "@/components/ui/button/Button.vue";
import ContextMenu from "@/components/ui/context-menu/ContextMenu.vue";
import ContextMenuContent from "@/components/ui/context-menu/ContextMenuContent.vue";
import ContextMenuItem from "@/components/ui/context-menu/ContextMenuItem.vue";
import ContextMenuTrigger from "@/components/ui/context-menu/ContextMenuTrigger.vue";
import { usePinnedServices } from "@/composables/pinned-service";
import { PinOffIcon } from "lucide-vue-next";

const { services, unpin: unpinService } = usePinnedServices();

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
  <div class="h-screen grid grid-rows-[auto_1fr]">
    <Header>
      <template #end>
        <RouterLink
          v-for="route in navigationRoutes"
          :to="route.to"
        >
          <Button
            class="cursor-pointer"
            variant="ghost"
          >
            {{ route.text }}
          </Button>
        </RouterLink>
      </template>
    </Header>

    <PageContent class="flex items-center justify-center p-4">
        <div class="flex flex-wrap justify-center gap-3">
          <template v-for="service in services">
            <ContextMenu>
              <ContextMenuTrigger>
                <ServiceAppLayout
                  class="max-w-[120px]"
                  :id="service.id"
                  :title="service.title"
                  :description="service.description"
                  :link="service.link"
                  :icon_url="service.icon_url"
                  :icon_wrap="service.icon_wrap"
                  :tags="service.tags"
                  :isEnabled="service.enabled"
                  :bgColor="service.bgColor"
                />
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem @click="unpinService(service.id.toString())">
                  <PinOffIcon /> Lösen
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </template>
      </div>
    </PageContent>
  </div>
</template>
