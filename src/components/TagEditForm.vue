<script setup lang="ts">
import { ref, watch } from "vue";

export type AddTagSubmitData = {
  name: string;
  color: string;
};

const props = defineProps<{
  initial?: Partial<AddTagSubmitData>;
}>();

watch(props, (newProps) => {
  if (!newProps.initial) {
    return;
  }

  form.value = {
    name: props.initial?.name || form.value.name,
    color: props.initial?.color || form.value.color,
  };
});

const initialFormData = (): AddTagSubmitData => ({
  name: "",
  color: "",
});

const form = ref<AddTagSubmitData>(initialFormData());

const emit = defineEmits<{
  (e: "submit", data: AddTagSubmitData): void;
}>();

const onSubmit = () => {
  emit("submit", { ...form.value });

  form.value = initialFormData();
};

const onCancel = () => {
  form.value = initialFormData();
};

const colorOptions = [
  { label: "red", value: "red" },
  { label: "orange", value: "orange" },
  { label: "amber", value: "amber" },
  { label: "yellow", value: "yellow" },
  { label: "lime", value: "lime" },
  { label: "green", value: "green" },
  { label: "emerald", value: "emerald" },
  { label: "teal", value: "teal" },
  { label: "cyan", value: "cyan" },
  { label: "sky", value: "sky" },
  { label: "blue", value: "blue" },
  { label: "indigo", value: "indigo" },
  { label: "violet", value: "violet" },
  { label: "purple", value: "purple" },
  { label: "fuchsia", value: "fuchsia" },
  { label: "pink", value: "pink" },
  { label: "rose", value: "rose" },
  { label: "slate", value: "slate" },
  { label: "gray", value: "gray" },
  { label: "zinc", value: "zinc" },
  { label: "neutral", value: "neutral" },
  { label: "stone", value: "stone" },
];
</script>

<template>
  <form class="grid p-3">
    <div>
      <label>
        Name
        <input
          type="text"
          v-model="form.name"
        />
      </label>
    </div>

    <div>
      <label>
        Farbe

        <select v-model="form.color">
          <option
            v-for="option in colorOptions"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
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
