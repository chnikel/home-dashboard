<script setup lang="ts">
import Header from "@/components/Header.vue";
import Page from "@/components/Page.vue";
import PageContent from "@/components/PageContent.vue";
import ServiceHorizontalLayout from "@/components/ServiceHorizontalLayout.vue";
import Button from "@/components/ui/button/Button.vue";
import ContextMenu from "@/components/ui/context-menu/ContextMenu.vue";
import ContextMenuContent from "@/components/ui/context-menu/ContextMenuContent.vue";
import ContextMenuItem from "@/components/ui/context-menu/ContextMenuItem.vue";
import ContextMenuTrigger from "@/components/ui/context-menu/ContextMenuTrigger.vue";
import { usePinnedServices } from "@/composables/pinned-service";
import {
  CircleXIcon,
  LoaderCircleIcon,
  PinIcon,
  PinOffIcon,
  PlusIcon,
} from "lucide-vue-next";

const {
  error,
  services,
  unpin: unpinService,
  isLoading: isLoadingServices,
} = usePinnedServices();
</script>

<template>
  <Page>
    <Header />

    <PageContent class="relative flex items-center justify-center p-3">
      <div
        v-if="isLoadingServices"
        class="absolute inset-0 z-40 flex items-center justify-center"
      >
        <LoaderCircleIcon class="animate-spin" />
      </div>
      <div
        v-else-if="error"
        class="flex flex-col items-center gap-3"
      >
        <CircleXIcon
          :size="24"
          color="#fb2c36"
        />

        <div class="text-center">
          <h3 class="text-lg font-bold">Ein Fehler ist aufgetreten</h3>
          <p class="text-neutral-500">{{ error }}</p>
        </div>
      </div>
      <div
        v-else-if="services.length === 0"
        class="flex flex-col items-center gap-3"
      >
        <PinIcon
          :size="24"
          color="gray"
        />

        <div class="text-center">
          <h3 class="text-lg font-bold">Keine angehefteten Apps</h3>
          <p class="text-neutral-500">Keine angehefteten Apps</p>
        </div>

        <RouterLink :to="{ name: 'apps' }">
          <Button variant="default">
            <PlusIcon />
            Apps anheften
          </Button>
        </RouterLink>
      </div>
      <div
        v-else
        class="flex flex-col gap-3 w-80"
      >
        <template v-for="service in services">
          <ContextMenu>
            <ContextMenuTrigger>
              <ServiceHorizontalLayout :data="service" />
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
  </Page>
</template>
