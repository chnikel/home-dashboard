<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from "reka-ui";
import { DialogRoot, useForwardPropsEmits } from "reka-ui";
import DialogContent from "./DialogContent.vue";
import DialogHeader from "./DialogHeader.vue";
import DialogTitle from "./DialogTitle.vue";
import { reactiveOmit } from "@vueuse/core";
import DialogFooter from "./DialogFooter.vue";

const props = defineProps<DialogRootProps & { title: string }>();
const emits = defineEmits<DialogRootEmits & {
  'submit': [value: any]
}>();

const delegatedProps = reactiveOmit(props, "title");
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DialogRoot
    data-slot="dialog"
    v-bind="forwarded"
  >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>

      <form class="max-h-[80vh] flex flex-col overflow-auto" @submit="emits('submit', $event)">
        <div class="mb-4 overflow-y-auto pr-4">
          <slot name="content" />
        </div>

        <DialogFooter class=" pr-4">
          <slot name="action" />
        </DialogFooter>
      </form>
    </DialogContent>
  </DialogRoot>
</template>
