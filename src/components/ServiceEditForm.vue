<script setup lang="ts">
import { ref } from "vue";

export type SubmitData = {
  title: string;
  description: string;
};

const props = defineProps<{
  initial?: {
    title?: string;
    description?: string;
  };
}>();

const form = ref<SubmitData>({
  title: props.initial?.title || "",
  description: props.initial?.description || "",
});

const emit = defineEmits<{
  (e: "submit", data: SubmitData): void;
}>();

const onSubmit = () => {
  emit("submit", { ...form.value });
};
</script>

<template>
  <form
    class="grid"
    @submit="onSubmit"
  >
    <div>
      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="grid-first-name"
      >
        First Name
        <input
          type="text"
          v-model="form.title"
        />
      </label>
    </div>

    <div>
      <label>
        First Name
        <input
          type="text"
          v-model="form.description"
        />
      </label>
    </div>

    <button data-type="primary">Speichern</button>
  </form>
</template>
