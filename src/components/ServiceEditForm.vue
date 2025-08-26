<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { getGroups, type ServiceTag } from "../api";
import Tag from "./Tag.vue";

export type SubmitData = {
  title: string;
  description: string;
  link: string;
  icon_url: string;
  icon_wrap: boolean;
  enabled: boolean;
  groupId: number | null;
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
  groupId: null,
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

const initialSelectedTag = "";

const availableTags = [
  {
    name: "automation",
    color: "blue",
  },
  {
    name: "test",
    color: "yellow",
  },
];

const selectedTag = ref(initialSelectedTag);

const addSelectedTag = () => {
  const foundTag = availableTags.find((tag) => tag.name === selectedTag.value);

  if (!foundTag) {
    return;
  }

  form.value.tags.push(foundTag);

  selectedTag.value = initialSelectedTag;
};

const handleTagRemove = (tag: string) => {
  form.value.tags = form.value.tags.filter((t) => t.name != tag);
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

        <div class="pb-3">
          <Tag
            v-for="tag in form.tags"
            :name="tag.name"
            :color="tag.color"
            :action="true"
            @action="() => handleTagRemove(tag.name)"
          />
        </div>

        <select v-model="selectedTag">
          <option
            v-for="option in availableTags"
            :value="option.name"
          >
            {{ option.name }}
          </option>
        </select>
        <button
          type="button"
          @click="addSelectedTag"
        >
          Tag hinzufügen
        </button>
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
        @click="onCancel"
      >
        Schließen
      </button>
    </div>
  </form>
</template>
