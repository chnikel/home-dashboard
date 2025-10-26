<script setup lang="ts">
import type { ServiceTag } from "../api";
import { computed } from "vue";
import Tag from "./Tag.vue";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const props = defineProps<{
  tags: ServiceTag[];
}>();

const sortedTags = computed(() => {
  return props.tags.sort((a, b) => {
    return b.weight - a.weight;
  });
});
</script>

<template>
  <div style="grid-area: tags">
    <Tag
      v-for="tag in sortedTags.slice(0, 3)"
      :color="tag.color"
      :name="tag.name"
    />

    <Popover v-if="sortedTags.length > 3">
      <PopoverTrigger @click.prevent>
        <Tag
          color="neutral"
          :name="`+${sortedTags.length - 3}`"
        />
      </PopoverTrigger>
      <PopoverContent>
        <Tag
          v-for="tag in sortedTags.slice(3)"
          :color="tag.color"
          :name="tag.name"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
