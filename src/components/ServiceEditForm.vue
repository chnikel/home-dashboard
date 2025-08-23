<script setup lang="ts">
import { ref } from "vue";

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

const form = ref<SubmitData>({
  title: props.initial?.title || "",
  description: props.initial?.description || "",
  link: props.initial?.link || "",
  icon_url: props.initial?.icon_url || "",
  icon_wrap: props.initial?.icon_wrap || false,
  enabled: props.initial?.enabled || true,
});

const emit = defineEmits<{
  (e: "submit", data: SubmitData): void;
}>();

const onSubmit = () => {
  emit("submit", { ...form.value });

  form.value = {
    title: "",
    description: "",
    link: "",
    icon_url: "",
    icon_wrap: false,
    enabled: true,
  };
};
</script>

<template>
  <form class="grid">
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
        icon_url
        <input
          type="text"
          v-model="form.icon_url"
        />
      </label>
    </div>

    <div>
      <label>
        Icon url
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

    <button
      data-type="primary"
      @click="onSubmit"
    >
      Speichern
    </button>
    <button>Schließen</button>
  </form>
</template>
