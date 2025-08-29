<script setup lang="ts">
import { watch } from "vue";

export type AddTagSubmitData = {
  name: string;
  color: string;
};

const props = defineProps<{
  initial?: Partial<AddTagSubmitData>;
}>();

watch(props, (newProps) => {
  if (!newProps.initial) {
    return;
  }

  // form.value = {
  //   name: props.initial?.name || form.value.name,
  //   color: props.initial?.color || form.value.color,
  // };
});

const emit = defineEmits<{
  (e: "submit", data: AddTagSubmitData): void;
}>();

const colorOptions = [
  { label: "red", value: "red" },
  { label: "orange", value: "orange" },
  { label: "amber", value: "amber" },
  { label: "yellow", value: "yellow" },
  { label: "lime", value: "lime" },
  { label: "green", value: "green" },
  { label: "emerald", value: "emerald" },
  { label: "teal", value: "teal" },
  { label: "cyan", value: "cyan" },
  { label: "sky", value: "sky" },
  { label: "blue", value: "blue" },
  { label: "indigo", value: "indigo" },
  { label: "violet", value: "violet" },
  { label: "purple", value: "purple" },
  { label: "fuchsia", value: "fuchsia" },
  { label: "pink", value: "pink" },
  { label: "rose", value: "rose" },
  { label: "slate", value: "slate" },
  { label: "gray", value: "gray" },
  { label: "zinc", value: "zinc" },
  { label: "neutral", value: "neutral" },
  { label: "stone", value: "stone" },
];

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
import SelectTrigger from "./ui/select/SelectTrigger.vue";
import SelectValue from "./ui/select/SelectValue.vue";
import SelectContent from "./ui/select/SelectContent.vue";
import SelectGroup from "./ui/select/SelectGroup.vue";
import SelectItem from "./ui/select/SelectItem.vue";
import Select from "./ui/select/Select.vue";
import DialogClose from "./ui/dialog/DialogClose.vue";

const formSchema = toTypedSchema(
  z.object({
    name: z.string(),
    color: z.string(),
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
        <Button variant="outline"> Tag hinzufügen </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tag hinzufügen</DialogTitle>
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
            name="name"
          >
            <FormItem>
              <FormLabel>Name</FormLabel>
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

          <FormField
            v-slot="{ componentField }"
            name="color"
          >
            <FormItem>
              <FormLabel>Color</FormLabel>

              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Wähle eine Farbe für dein Tag" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="option in colorOptions"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
              Hinzufügen
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
