<script setup lang="ts">
import { updateService, type GetServicesResponse } from "@/api";
import ServiceEditForm, { type SubmitData } from "./ServiceEditForm.vue";
import Button from "./ui/button/Button.vue";

const props = defineProps<{ service: GetServicesResponse; edit: boolean }>();

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "delete"): void;
}>();

const onDragStart = (event: DragEvent) => {
  event.dataTransfer?.setData("text/plain", props.service.id.toString());
};

const handleEditService = async (data: SubmitData) => {
  if (!props.service.id) {
    alert("Keine Service ID");
    return;
  }
  // const tags = data.tags.map((t) => t.name);

  try {
    await updateService(props.service.id, {
      title: data.title,
      description: data.description,
      link: data.link,
      icon_url: data.icon_url,
      icon_wrap: data.icon_wrap,
      enabled: data.enabled,
      groupId: data.groupId || null,
      tags: [],
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
        <ServiceEditForm
          buttonText="Bearbeiten"
          submitText="Speichern"
          :initial="{
            title: service.title,
            description: service.description,
            link: service.link,
            icon_url: service.icon_url,
            icon_wrap: service.icon_wrap,
            enabled: service.enabled,
            groupId: service.groupId,
            tags: service.tags,
          }"
          @submit="handleEditService($event)"
        />
        <Button
          data-type="danger"
          @click="emit('delete')"
        >
          Löschen
        </Button>
      </div>
    </div>
    <slot />
  </div>
</template>
