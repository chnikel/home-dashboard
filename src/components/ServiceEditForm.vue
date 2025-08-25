<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from "vue";
import { getGroups, getTags, type ServiceTag } from "../api";
import type { AddTagSubmitData } from "./TagEditForm.vue";
import TagEditForm from "./TagEditForm.vue";

export type SubmitData = {
  title: string;
  description: string;
  link: string;
  icon_url: string;
  icon_wrap: boolean;
  enabled: boolean;
  groupId?: number;
  tags: Omit<ServiceTag, "id">[];
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
    groupId: props.initial?.groupId || form.value.groupId,
    tags: props.initial?.tags || form.value.tags,
  };
});

const initialFormData = (): SubmitData => ({
  title: "",
  description: "",
  link: "",
  icon_url: "",
  icon_wrap: false,
  enabled: true,
  tags: [],
});

const form = ref<SubmitData>(initialFormData());

const emit = defineEmits<{
  (e: "submit", data: SubmitData): void;
}>();

const onSubmit = () => {
  emit("submit", { ...form.value });

  form.value = initialFormData();
};

const onCancel = () => {
  form.value = initialFormData();
};

const groupOptions = ref<{ label: string; value: number }[]>([]);

onMounted(async () => {
  const groups = await getGroups();

  groupOptions.value = groups.map((group) => ({
    label: group.title,
    value: group.id,
  }));
});

const tagOptions = ref<{ label: string; value: number }[]>([]);

onMounted(async () => {
  const tags = await getTags();

  tagOptions.value = tags.map((tag) => ({
    label: tag.name,
    value: tag.id,
    color: tag.color,
  }));
});

const addTagDialog = useTemplateRef<HTMLDialogElement>("add-tag-dialog");

const handleAddTag = (data: AddTagSubmitData) => {
  form.value.tags = [data, ...form.value.tags];
};

const classes = {
  red: "bg-red-100 text-red-800",
  orange: "bg-orange-100 text-orange-800",
  amber: "bg-amber-100 text-amber-800",
  yellow: "bg-yellow-100 text-yellow-800",
  lime: "bg-lime-100 text-lime-800",
  green: "bg-green-100 text-green-800",
  emerald: "bg-emerald-100 text-emerald-800",
  teal: "bg-teal-100 text-teal-800",
  cyan: "bg-cyan-100 text-cyan-800",
  sky: "bg-sky-100 text-sky-800",
  blue: "bg-blue-100 text-blue-800",
  indigo: "bg-indigo-100 text-indigo-800",
  violet: "bg-violet-100 text-violet-800",
  purple: "bg-purple-100 text-purple-800",
  fuchsia: "bg-fuchsia-100 text-fuchsia-800",
  pink: "bg-pink-100 text-pink-800",
  rose: "bg-rose-100 text-rose-800",
  slate: "bg-slate-100 text-slate-800",
  gray: "bg-gray-100 text-gray-800",
  zinc: "bg-zinc-100 text-zinc-800",
  neutral: "bg-neutral-100 text-neutral-800",
  stone: "bg-stone-100 text-stone-800",
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

    <div>
      <label>
        Group
        <select v-model="form.groupId">
          <option
            v-for="option in groupOptions"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>

    <div>
      <label>
        Tags
        <div>
          <span
            v-for="tag in form.tags"
            :class="`${(classes as any)[tag.color]} text-xs font-medium me-2 px-2.5 py-0.5 rounded`"
          >
            {{ tag.name }}
          </span>
        </div>
      </label>
    </div>
    <button
      type="button"
      @click="addTagDialog?.showModal()"
    >
      Tag hinzufügen
    </button>

    <dialog
      ref="add-tag-dialog"
      class="z-10"
    >
      <TagEditForm
        method="dialog"
        @submit="handleAddTag($event)"
      />
    </dialog>

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
