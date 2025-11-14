<script setup lang="ts">
import type { ServiceTag } from "../api";
import { computed } from "vue";
import Tag from "./Tag.vue";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const props = withDefaults(
  defineProps<{
    tags: ServiceTag[];
    max?: number;
  }>(),
  {
    max: 3,
  }
);

const sortedTags = computed(() => {
  return props.tags.sort((a, b) => {
    return b.weight - a.weight;
  });
});
</script>

<template>
  <div style="grid-area: tags">
    <Tag
      v-for="tag in sortedTags.slice(0, props.max)"
      :color="tag.color"
      :name="tag.name"
    />

    <Popover v-if="sortedTags.length > props.max">
      <PopoverTrigger @click.prevent>
        <Tag
          color="neutral"
          :name="`+${sortedTags.length - props.max}`"
        />
      </PopoverTrigger>
      <PopoverContent>
        <Tag
          v-for="tag in sortedTags.slice(props.max)"
          :color="tag.color"
          :name="tag.name"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
