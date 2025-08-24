<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import EditGroupWrapper from "./EditGroupWrapper.vue";
import GroupEditForm, { type AddGroupSubmitData } from "./GroupEditForm.vue";
import { moveService } from "../api";

const props = defineProps<{
  id: number;
  edit: boolean;
  title: string;
}>();

const emit = defineEmits<{
  (e: "edit", data: AddGroupSubmitData): void;
  (e: "delete"): void;
  (e: "move"): void;
}>();

const editGroupDialog = useTemplateRef<HTMLDialogElement>("edit-group-dialog");

const groupData = ref<AddGroupSubmitData | null>(null);

const onEdit = (data: AddGroupSubmitData) => {
  emit("edit", data);
};

const editGroup = () => {
  groupData.value = {
    title: props.title,
  };

  editGroupDialog.value?.showModal();
};

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
</script>

<template>
  <div
    @drop="edit && onDrop($event)"
    @dragover="edit && onDragOver($event)"
    @dragleave="edit && (isOver = false)"
    @dragend="edit && (isOver = false)"
    class="text-white"
    :class="{
      'outline-2 outline-offset-4 rounded outline-blue-500 z-10': isOver,
      '': !isOver,
    }"
  >
    <EditGroupWrapper
      :edit="edit"
      @edit="editGroup()"
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

  <dialog ref="edit-group-dialog">
    <GroupEditForm
      method="dialog"
      :initial="groupData || undefined"
      @submit="onEdit($event)"
    />
  </dialog>
</template>
