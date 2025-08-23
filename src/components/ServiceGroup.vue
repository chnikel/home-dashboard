<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import EditGroupWrapper from "./EditGroupWrapper.vue";
import GroupEditForm, { type AddGroupSubmitData } from "./GroupEditForm.vue";

const props = defineProps<{
  edit: boolean;
  title: string;
}>();

const emit = defineEmits<{
  (e: "edit", data: AddGroupSubmitData): void;
  (e: "delete"): void;
}>();

const editGroupDialog = useTemplateRef<HTMLDialogElement>("edit-group-dialog");

const groupData = ref<AddGroupSubmitData | null>(null);

const onEdit = (data: AddGroupSubmitData) => {
  emit('edit', data)
}

const editGroup = () => {
  groupData.value = {
    title: props.title,
  };

  editGroupDialog.value?.showModal()
};
</script>

<template>
  <div class="text-white">
    <EditGroupWrapper
      :edit="edit"
      @edit="editGroup()"
      @delete="$emit('delete')"
    >
      <h2 class="text-2xl font-light py-2 px-4">{{ title || '<missing title>' }}</h2>
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
