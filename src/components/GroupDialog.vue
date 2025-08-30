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
import { addGroup } from "@/api";

const emit = defineEmits<{
  (e: "success"): void;
}>()

const props = defineProps<{ open: boolean; handleClose: () => void }>();

const formSchema = toTypedSchema(
  z.object({
    title: z.string(),
  })
);

async function onSubmit(values: any) {
   try {
    await addGroup({
      title: values.title
    });
    
    emit("success")
  } catch (error) {
    console.log(error);
  }

  props.handleClose();
}
</script>

<template>
  <Form
    v-slot="{ handleSubmit }"
    as=""
    :keep-values="false"
    :validation-schema="formSchema"
  >
    <Dialog
      :open="open"
      @update:open="handleClose"
    >
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gruppe hinzufügen</DialogTitle>
        </DialogHeader>

        <form
          id="dialogForm"
          @submit="handleSubmit($event, onSubmit)"
        >
          <FormField
            v-slot="{ componentField }"
            name="title"
          >
            <FormItem>
              <FormLabel>Gruppenname</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autocomplete="off"
                  v-bind="componentField"
                />
              </FormControl>
            </FormItem>
          </FormField>
        </form>

        <DialogFooter>
          <Button
            type="submit"
            form="dialogForm"
          >
            Hinzufügen
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
