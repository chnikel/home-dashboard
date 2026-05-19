<script setup lang="ts">
import { computed, ref } from "vue";
import EditGroupWrapper from "./EditGroupWrapper.vue";
import { moveService, updateGroup } from "../api";
import GroupDialog, { type GroupDialogFormData } from "./GroupDialog.vue";
import { provide } from "vue";
import GroupContextMenuWrapper from "./GroupContextMenuWrapper.vue";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-vue-next";
import Button from "./ui/button/Button.vue";
import Badge from "./ui/badge/Badge.vue";

const props = defineProps<{
  compact?: boolean;
  id: string;
  edit: boolean;
  title: string;
  serviceCount?: number;
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

const isCollapsed = ref(localStorage.getItem(`collapsed_${props.id}`) == "true" || false);

const toggleCollapsed = (groupId: string) => {
  isCollapsed.value = !isCollapsed.value;

  localStorage.setItem(`collapsed_${groupId}`, isCollapsed.value.toString());
};
</script>

<template>
  <div
    @drop="edit && onDrop($event)"
    @dragover="edit && onDragOver($event)"
    @dragleave="edit && (isOver = false)"
    @dragend="edit && (isOver = false)"
    class="text-white rounded-lg shadow-lg outline"
    :class="{
      'outline-2 outline-offset-4 rounded outline-blue-500 z-10': isOver,
      '': !isOver,
    }"
  >
    <EditGroupWrapper
      :edit="edit"
      :isCollapsed="isCollapsed"
      @edit="showGroupDialog = true"
      @delete="$emit('delete')"
    >
      <GroupContextMenuWrapper
        @edit="showGroupDialog = true"
        @delete="emit('delete')"
      >
        <div
          class="p-4 flex justify-between items-center"
          @click="toggleCollapsed(id)"
        >
          <div>
            <h2 class="text-xl inline mr-2">
              <template v-if="id == '-1'"><i>Ungruppiert</i></template>
              <template v-else>{{ title }}</template>
            </h2>
            <Badge
              class="inline"
              variant="outline"
              >{{ serviceCount }}</Badge
            >
          </div>

          <div>
            <Button
              variant="outline"
              size="icon"
            >
              <ChevronDownIcon v-if="isCollapsed" />
              <ChevronUpIcon v-else />
            </Button>
          </div>
        </div>
      </GroupContextMenuWrapper>
    </EditGroupWrapper>
    <div
      v-if="!isCollapsed"
      class="grid p-4 justify-center md:justify-start border-t bg-neutral-800/30 rounded-b-lg"
      :class="{
        'grid-cols-[repeat(auto-fit,120px)] gap-1': compact,
        'grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 px-4': !compact,
      }"
    >
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
