<script setup lang="ts">
import { ref, watch } from "vue";

export type SubmitData = {
  title: string;
  description: string;
  link: string;
  icon_url: string;
  icon_wrap: boolean;
  enabled: boolean;
};

const props = defineProps<{
  initial?: Partial<SubmitData>;
}>();

watch(props, (newProps) => {
  if (!newProps.initial) {
    return;
  }

  form.value = {
    title: props.initial?.title || form.value.title,
    description: props.initial?.description || form.value.description,
    link: props.initial?.link || form.value.link,
    icon_url: props.initial?.icon_url || form.value.icon_url,
    icon_wrap: props.initial?.icon_wrap || form.value.icon_wrap,
    enabled: props.initial?.enabled || form.value.enabled,
  };
});

const initialFormData: SubmitData = {
  title: "",
  description: "",
  link: "",
  icon_url: "",
  icon_wrap: true,
  enabled: true,
};

const form = ref<SubmitData>(initialFormData);

const emit = defineEmits<{
  (e: "submit", data: SubmitData): void;
}>();

const onSubmit = () => {
  emit("submit", { ...form.value });

  form.value = initialFormData;
};
</script>

<template>
  <form class="grid p-3">
    <div>
      <label>
        First Name
        <input
          type="text"
          v-model="form.title"
        />
      </label>
    </div>

    <div>
      <label>
        Description
        <textarea v-model="form.description"></textarea>
      </label>
    </div>

    <div>
      <label>
        Link
        <input
          type="text"
          v-model="form.link"
        />
      </label>
    </div>

    <div>
      <label>
        Icon url
        <input
          type="text"
          v-model="form.icon_url"
        />
      </label>
    </div>

    <div>
      <label>
        Icon wrap
        <input
          type="checkbox"
          v-model="form.icon_wrap"
        />
      </label>
    </div>

    <div>
      <label>
        Enabled
        <input
          type="checkbox"
          v-model="form.enabled"
        />
      </label>
    </div>

    <div class="space-x-2">
      <button
      data-type="primary"
      @click="onSubmit"
    >
      Speichern
    </button>
    <button data-variant="outline">Schließen</button>
    </div>
  </form>
</template>
