<script setup lang="ts">
import { LayoutGridIcon, LayoutListIcon } from "lucide-vue-next";
import ButtonGroup from "./ui/button-group/ButtonGroup.vue";
import Button from "./ui/button/Button.vue";

const props = defineProps(["modelValue"]);
const model = defineModel();
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <ButtonGroup>
    <Button
      class="cursor-pointer"
      :variant="model ? 'outline' : 'default'"
      size="icon"
      @click="emit('update:modelValue', false)"
    >
      <LayoutListIcon />
    </Button>
    <Button
      class="cursor-pointer"
      :variant="model ? 'default' : 'outline'"
      size="icon"
      @click="emit('update:modelValue', true)"
    >
      <LayoutGridIcon />
    </Button>
  </ButtonGroup>
</template>
