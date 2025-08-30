<script setup lang="ts">
import {
  updateGroup,
  type AddGroupRequest,
  type GetGroupsResponse,
} from "@/api";
import GroupEditForm from "./GroupEditForm.vue";
import Button from "./ui/button/Button.vue";

const props = defineProps<{
  group: GetGroupsResponse;
  edit: boolean;
}>();

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "delete"): void;
}>();

const handleEditGroup = async (data: AddGroupRequest) => {
  if (!props.group.id) {
    return;
  }
  try {
    await updateGroup(props.group.id?.toString(), data);
  } catch (error) {
    console.log(error);
  }

  emit("edit");
};
</script>

<template>
  <div
    class="relative group"
    :class="{
      'outline outline-gray-500 outline-dashed rounded-2xl': edit,
    }"
  >
    <div
      v-if="edit"
      class="absolute inset-0 hidden group-hover:block bg-neutral-500/30 rounded-2xl space-x-1"
    >
      <div class="flex gap-3 justify-center items-center h-full">
        <GroupEditForm
          button-text="Bearbeiten"
          submit-text="Speichern"
          :initial="{
            title: group.title,
          }"
          @submit="handleEditGroup($event)"
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
