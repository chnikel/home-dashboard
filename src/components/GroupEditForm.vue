<script setup lang="ts">
import { ref, watch } from "vue";

export type AddGroupSubmitData = {
  title: string;
};

const props = defineProps<{
  initial?: Partial<AddGroupSubmitData>;
}>();

watch(props, (newProps) => {
  if (!newProps.initial) {
    return;
  }

  form.value = {
    title: props.initial?.title || form.value.title,
  };
});

const initialFormData: AddGroupSubmitData = {
  title: "",
};

const form = ref<AddGroupSubmitData>(initialFormData);

const emit = defineEmits<{
  (e: "submit", data: AddGroupSubmitData): void;
}>();

const onSubmit = () => {
  emit("submit", { ...form.value });

  form.value = initialFormData;
};

const onCancel = () => {
  form.value = initialFormData;
};
</script>

<template>
  <form class="grid p-3">
    <div>
      <label>
        Title
        <input
          type="text"
          v-model="form.title"
        />
      </label>
    </div>

    <div class="space-x-2 mt-3">
      <button
        data-type="primary"
        @click="onSubmit"
      >
        Speichern
      </button>
      <button
        data-variant="outline"
        @click="onCancel()"
      >
        Schließen
      </button>
    </div>
  </form>
</template>
