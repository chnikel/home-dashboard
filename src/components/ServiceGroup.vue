<script setup lang="ts">
import { ref } from "vue";
import EditGroupWrapper from "./EditGroupWrapper.vue";
import { moveService, type GetGroupsResponse } from "../api";

const props = defineProps<{
  group: GetGroupsResponse;
  edit: boolean;
  title: string;
}>();

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "delete"): void;
  (e: "move"): void;
}>();

const onDragOver = (event: DragEvent) => {
  event.preventDefault();

  isOver.value = true;
};

const onDrop = async (event: DragEvent) => {
  const serviceId = event.dataTransfer?.getData("text/plain");

  if (!serviceId) {
    console.log("serviceId nicht gefunden");
    return;
  }

  await moveService(serviceId, props.group.id?.toString() || null);

  emit("move");

  isOver.value = false;
};

const isOver = ref(false);
</script>

<template>
  <div
    @drop="edit && onDrop($event)"
    @dragover="edit && onDragOver($event)"
    @dragleave="edit && (isOver = false)"
    @dragend="edit && (isOver = false)"
    class="text-white mt-8"
    :class="{
      'outline-2 outline-offset-4 rounded outline-blue-500 z-10': isOver,
      '': !isOver,
    }"
  >
    <EditGroupWrapper
      :group="group"
      :edit="edit"
      @edit="$emit('edit')"
      @delete="$emit('delete')"
    >
      <h2 class="text-2xl font-light py-2 px-4">
        {{ title }}
      </h2>
    </EditGroupWrapper>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 lg:gap-2 lg:gap-y-4"
    >
      <slot />
    </div>
  </div>
</template>
