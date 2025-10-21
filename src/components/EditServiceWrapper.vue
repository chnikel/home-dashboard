<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "./ui/button/Button.vue";
import { updateService, type GetServicesResponse } from "@/api";
import type { ServiceDialogFormData } from "./ServiceDialog.vue";
import ServiceDialog from "./ServiceDialog.vue";
import { findTag } from "@/store";

const props = defineProps<{
  id: number;
  edit: boolean;
  service: GetServicesResponse;
}>();

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "delete"): void;
}>();

const data = computed<Partial<ServiceDialogFormData>>(() => {
  return {
    title: props.service.title,
    description: props.service.description,
    link: props.service.link,
    icon_url: props.service.icon_url,
    icon_wrap: props.service.icon_wrap,
    enabled: props.service.enabled ?? true,
    groupId: props.service.groupId,
    tagIds: props.service.tags.map((t) => t.id),
  };
});

const onDragStart = (event: DragEvent) => {
  event.dataTransfer?.setData("text/plain", props.id.toString());
};
const showEditServiceDialog = ref(false);

const onEditService = async (data: ServiceDialogFormData) => {
  const tags = (data.tagIds || []).reduce<string[]>((acc, id) => {
    const tag = findTag(id);
    if (tag) {
      acc.push(tag.name);
    }

    return acc;
  }, []);

  try {
    await updateService(props.service.id.toString(), {
      title: data.title,
      description: data.description,
      link: data.link,
      icon_url: data.icon_url,
      icon_wrap: data.icon_wrap,
      enabled: data.enabled,
      groupId: data.groupId,
      tags,
    });
  } catch (error) {
    console.log(error);
  }

  emit("edit");
};
</script>

<template>
  <div
    @dragstart="edit && onDragStart($event)"
    class="relative group border border-dashed"
    :class="{
      'border-gray-500 rounded-2xl': edit,
      'border-transparent': !edit,
    }"
  >
    <div
      v-if="edit"
      class="absolute inset-0 hidden group-hover:block bg-neutral-500/30 rounded-2xl space-x-1"
    >
      <div class="flex gap-3 justify-center items-center h-full">
        <Button
          data-variant="outline"
          @click="showEditServiceDialog = true"
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

    <template v-if="showEditServiceDialog">
      <ServiceDialog
        :open="showEditServiceDialog"
        :handleClose="() => (showEditServiceDialog = false)"
        :data="data"
        @submit="onEditService"
        title="Service bearbeiten"
        submitButton="Speichern"
      />
    </template>
  </div>
</template>
