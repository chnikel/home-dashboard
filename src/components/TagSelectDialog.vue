<script setup lang="ts">
import { useTemplateRef } from "vue";
import Tag from "./Tag.vue";

const dialog = useTemplateRef<HTMLDialogElement>("dialog");

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
</script>

<template>
  <dialog ref="dialog">
    <div class="grid p-3">
      
      <Tag name="dwa" color="red" />

    </div>
  </dialog>
</template>
