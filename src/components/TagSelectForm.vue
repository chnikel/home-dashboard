<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { getTags } from "../api";

export type SelectTagSubmitData = {
  tagId: string;
};

const props = defineProps<{
  initial?: Partial<SelectTagSubmitData>;
}>();

watch(props, (newProps) => {
  if (!newProps.initial) {
    return;
  }

  form.value = {
    tagId: props.initial?.tagId || form.value.tagId,
  };
});

const initialFormData = (): SelectTagSubmitData => ({
  tagId: "",
});

const form = ref<SelectTagSubmitData>(initialFormData());

const emit = defineEmits<{
  (e: "submit", data: SelectTagSubmitData): void;
}>();

const onSubmit = () => {
  emit("submit", { ...form.value });

  form.value = initialFormData();
};

const onCancel = () => {
  form.value = initialFormData();
};

const tagOptions = ref<{ label: string; value: number; color: string }[]>([]);

onMounted(async () => {
  const tags = await getTags();

  tagOptions.value = tags.map((tag) => ({
    label: tag.name,
    value: tag.id,
    color: tag.color,
  }));
});
</script>

<template>
  <form class="grid p-3">
    <div>
      <label>
        Tag

        <select v-model="form.tagId">
          <option
            v-for="tag in tagOptions"
            :value="tag.value"
          >
            {{ tag.label }}
          </option>
        </select>
      </label>
    </div>

    <div class="space-x-2 mt-3">
      <button
        data-type="primary"
        @click="onSubmit"
      >
        Hinzufügen
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
