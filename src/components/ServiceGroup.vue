<script setup lang="ts">
import { computed, ref } from "vue";
import EditGroupWrapper from "./EditGroupWrapper.vue";
import { moveService, updateGroup } from "../api";
import GroupDialog, { type GroupDialogFormData } from "./GroupDialog.vue";
import { provide } from "vue";
import GroupContextMenuWrapper from "./GroupContextMenuWrapper.vue";

const props = defineProps<{
  compact?: boolean;
  id: string;
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

const data = computed<Partial<GroupDialogFormData>>(() => {
  return {
    title: props.title,
  };
});
</script>

<template>
  <div
    @drop="edit && onDrop($event)"
    @dragover="edit && onDragOver($event)"
    @dragleave="edit && (isOver = false)"
    @dragend="edit && (isOver = false)"
    class="text-white mt-8 snap-start outline rounded-lg bg-neutral-900"
    :class="{
      'outline-2 outline-offset-4 rounded outline-blue-500 z-10': isOver,
      '': !isOver,
    }"
  >
    <EditGroupWrapper
      class="h-12 flex items-center"
      :edit="edit"
      @edit="showGroupDialog = true"
      @delete="$emit('delete')"
    >
      <GroupContextMenuWrapper
        @edit="showGroupDialog = true"
        @delete="emit('delete')"
      >
        <h2 class="text-2xl font-light inline px-3">
          {{ title }}
        </h2>
      </GroupContextMenuWrapper>
    </EditGroupWrapper>
    <hr />
    <div class="grid p-2.5 grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
      <slot />
    </div>
  </div>

  <template v-if="showGroupDialog">
    <GroupDialog
      :open="showGroupDialog"
      :data="data"
      :handleClose="() => (showGroupDialog = false)"
      @submit="onEditGroupSuccess"
      title="Gruppe bearbeiten"
      submitButton="Speichern"
    />
  </template>
</template>
