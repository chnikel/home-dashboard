<script setup lang="ts">
import { watch } from "vue";

export type AddGroupSubmitData = {
  title: string;
};

const props = defineProps<{
  buttonText: string;
  submitText: string;
  initial?: Partial<AddGroupSubmitData>;
}>();

const emit = defineEmits<{
  (e: "submit", data: AddGroupSubmitData): void;
}>();

import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DialogClose from "./ui/dialog/DialogClose.vue";

const formSchema = toTypedSchema(
  z.object({
    title: z.string().default(props.initial?.title || ""),
  })
);

function onSubmit(values: any) {
  emit("submit", values);
}
</script>

<template>
  <Form
    v-slot="{ handleSubmit }"
    as=""
    keep-values
    :validation-schema="formSchema"
  >
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline"> {{ buttonText }} </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{{ buttonText }}</DialogTitle>
          <DialogDescription>
            <!-- Make changes to your profile here. Click save when you're done. -->
          </DialogDescription>
        </DialogHeader>

        <form
          id="dialogForm"
          class="space-y-3"
          @submit="handleSubmit($event, onSubmit)"
        >
          <FormField
            v-slot="{ componentField }"
            name="title"
          >
            <FormItem>
              <FormLabel>Gruppen Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder=""
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>

        <DialogFooter>
          <DialogClose as-child>
            <Button
              type="submit"
              form="dialogForm"
            >
              {{ submitText }}
            </Button>
          </DialogClose>
          <DialogClose as-child>
            <Button
              type="button"
              variant="secondary"
            >
              Abbrechen
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Form>
</template>
