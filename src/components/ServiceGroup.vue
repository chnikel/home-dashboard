<script setup lang="ts">
import { ref } from "vue";
import EditGroupWrapper from "./EditGroupWrapper.vue";
import { moveService, updateGroup } from "../api";
import GroupDialog from "./GroupDialog.vue";
import { provide } from "vue";

const props = defineProps<{
  compact?: boolean;
  id: number;
  edit: boolean;
  title: string;
}>();

provide("editable", !!props.id);
provide("deletable", !!props.id);

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

  await moveService(serviceId, props.id?.toString() || null);

  emit("move");

  isOver.value = false;
};

const isOver = ref(false);
const showGroupDialog = ref(false);

const onEditGroupSuccess = async (data: { title: string }) => {
  try {
    await updateGroup(props.id, {
      title: data.title,
    });
  } catch (error) {
    console.log(error);
  }

  emit("edit");
};
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
      class="h-12"
      :edit="edit"
      @edit="showGroupDialog = true"
      @delete="$emit('delete')"
    >
      <h2
        class="text-2xl font-light"
        :class="{
          'px-4 py-2': !compact,
          'py-4': compact,
        }"
      >
        {{ title }}
      </h2>
    </EditGroupWrapper>
    <div
      class=""
      :class="{
        'flex flex-wrap gap-1': compact,
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 lg:gap-2 lg:gap-y-4':
          !compact,
      }"
    >
      <slot />
    </div>
  </div>

  <GroupDialog
    :open="showGroupDialog"
    :data="{
      title: title,
    }"
    :handleClose="() => (showGroupDialog = false)"
    @submit="onEditGroupSuccess"
    title="Gruppe bearbeiten"
    submitButton="Speichern"
  />
</template>
