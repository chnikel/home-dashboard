<script setup lang="ts">
import { type GetServicesResponse } from "@/api";
import { usePinnedServices } from "@/composables/pinned-service";
import ServiceRepository from "@/repositories/ServiceRepository";
import TagRepository from "@/repositories/TagRepository";
import { useRouter } from "vue-router";
import ServiceContextMenuWrapper from "./ServiceContextMenuWrapper.vue";
import Button from "./ui/button/Button.vue";

const props = defineProps<{
  id: number;
  edit: boolean;
  service: GetServicesResponse;
}>();

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "toggleVisibility"): void;
  (e: "toggleTag"): void;
  (e: "delete"): void;
}>();

const onDragStart = (event: DragEvent) => {
  event.dataTransfer?.setData("text/plain", props.id.toString());
};

async function toggleServiceVisibility() {
  if (props.service.enabled) {
    await ServiceRepository.disable(props.service.id.toString());
  } else {
    await ServiceRepository.enable(props.service.id.toString());
  }

  emit("toggleVisibility");
}

async function handleToggleTag(tagId: number) {
  await TagRepository.toggleVisibility(
    props.service.id.toString(),
    tagId.toString(),
  );

  emit("toggleTag");
}

const { toggle: handleTogglePinned, isPinned } = usePinnedServices();

const router = useRouter();

const onEditClick = () => {
  router.push({
    name: "service-edit",
    params: { id: props.id },
  });
};
</script>

<template>
  <div
    @dragstart="edit && onDragStart($event)"
    class="relative group"
  >
    <ServiceContextMenuWrapper
      :isEnabled="service.enabled"
      :tags="service.tags.map((t) => t.name)"
      :isPinned="isPinned(service.id.toString())"
      @toggle-visibility="toggleServiceVisibility()"
      @edit="onEditClick()"
      @delete="emit('delete')"
      @toggle-tag="handleToggleTag"
      @toggle-pinned="handleTogglePinned(service.id.toString())"
    >
      <div
        v-if="edit"
        class="absolute inset-0 hidden group-hover:block bg-neutral-500/30 rounded-2xl space-x-1 z-20"
      >
        <div class="flex flex-col gap-3 justify-center items-center h-full">
          <Button
            data-variant="outline"
            @click="onEditClick()"
          >
            Bearbeiten
          </Button>
          <Button
            variant="destructive"
            @click="emit('delete')"
          >
            Löschen
          </Button>
        </div>
      </div>

      <slot />
    </ServiceContextMenuWrapper>
  </div>
</template>
