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
import { FormField } from "./ui/form";
import FormItem from "./ui/form/FormItem.vue";
import FormLabel from "./ui/form/FormLabel.vue";
import FormControl from "./ui/form/FormControl.vue";
import Input from "./ui/input/Input.vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";

const props = defineProps<{
  open: boolean;
  handleClose: () => void;
  data?: Partial<GroupDialogFormData> | null;
  title: string;
  submitButton: string;
}>();

const GroupDialogFormData = z.object({
  title: z.string(),
});

export type GroupDialogFormData = z.infer<typeof GroupDialogFormData>;

const formSchema = toTypedSchema(GroupDialogFormData);

const form = useForm({
  validationSchema: formSchema,
  initialValues: props.data
    ? {
        title: props.data?.title,
      }
    : undefined,
});

const emit = defineEmits<{
  (e: "submit", data: GroupDialogFormData): void;
}>();

const onSubmit = form.handleSubmit((values) => {
  emit("submit", values);

  props.handleClose();
});
</script>

<template>
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
        @submit="onSubmit"
        class="space-y-3"
      >
        <FormField
          v-slot="{ componentField }"
          name="title"
        >
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                type="text"
                autocomplete="off"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button type="submit">
            {{ submitButton }}
          </Button>
          <Button
            type="button"
            variant="secondary"
            @click="handleClose"
          >
            Schließen
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
