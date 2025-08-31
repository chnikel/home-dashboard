<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import z from "zod";
import Button from "./ui/button/Button.vue";
import { Form, FormField } from "./ui/form";
import FormItem from "./ui/form/FormItem.vue";
import FormLabel from "./ui/form/FormLabel.vue";
import FormControl from "./ui/form/FormControl.vue";
import Input from "./ui/input/Input.vue";
import { toTypedSchema } from "@vee-validate/zod";
import { type TagColors } from "./Tag.vue";
import ColorItem from './ColorItem.vue'

const TagDialogFormData = z.object({
  name: z.string(),
  color: z.string(),
});

export type TagDialogFormData = z.infer<typeof TagDialogFormData>;

const emit = defineEmits<{
  (e: "submit", data: TagDialogFormData): void;
}>();

const props = defineProps<{
  open: boolean;
  handleClose: () => void;
  data?: Partial<TagDialogFormData> | null;
  title: string;
  submitButton: string;
}>();

const formSchema = toTypedSchema(TagDialogFormData);

async function onSubmit(values: any) {
  const data = values as TagDialogFormData;
  emit("submit", {
    name: data.name,
    color: data.color,
  });

  props.handleClose();
}

const validColors: TagColors[] = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
];
</script>

<template>
  <Form
    v-slot="{ handleSubmit }"
    as=""
    :keep-values="false"
    :initial-values="{
      name: data?.name,
    }"
    :validation-schema="formSchema"
  >
    <Dialog
      :open="open"
      @update:open="handleClose"
    >
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{{ title }}</DialogTitle>
        </DialogHeader>

        <form
          id="dialogForm"
          @submit="handleSubmit($event, onSubmit)"
          class="space-y-3"
        >
          <FormField
            v-slot="{ componentField }"
            name="name"
          >
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autocomplete="off"
                  v-bind="componentField"
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ value, setValue }"
            name="color"
          >
            <FormItem>
              <FormLabel>Farbe</FormLabel>
              <FormControl>
                <div class="flex gap-1 flex-wrap">
                  <template v-for="color in validColors">
                    <ColorItem
                      class="cursor-pointer border rounded"
                      :class="{
                        'border-primary': color === value,
                        'border-transparent': color !== value,
                      }"
                      :color="color"
                      @click="setValue(color)"
                    />
                  </template>
                </div>
              </FormControl>
            </FormItem>
          </FormField>
        </form>

        <DialogFooter>
          <Button
            type="submit"
            form="dialogForm"
          >
            {{ submitButton }}
          </Button>
          <Button
            type="button"
            variant="secondary"
            form="dialogForm"
            @click="handleClose"
          >
            Schließen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Form>
</template>
