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
import Textarea from "./ui/textarea/Textarea.vue";
import Switch from "./ui/switch/Switch.vue";
import FormDescription from "./ui/form/FormDescription.vue";
import ServiceIcon from "./ServiceIcon.vue";

const ServiceDialogFormData = z.object({
  title: z.string(),
  description: z.string().optional().default(""),
  link: z.string().optional().default(""),
  icon_url: z.string().optional().default(""),
  icon_wrap: z.boolean().optional().default(false),
  enabled: z.boolean().default(true),
});

export type ServiceDialogFormData = z.infer<typeof ServiceDialogFormData>;

const emit = defineEmits<{
  (e: "submit", data: ServiceDialogFormData): void;
}>();

const props = defineProps<{
  open: boolean;
  handleClose: () => void;
  data?: Partial<ServiceDialogFormData> | null;
  title: string;
  submitButton: string;
}>();

const formSchema = toTypedSchema(ServiceDialogFormData);

async function onSubmit(values: any) {
  const data = values as ServiceDialogFormData;
  emit("submit", {
    title: data.title,
    description: data.description,
    link: data.link,
    icon_url: data.icon_url,
    icon_wrap: data.icon_wrap,
    enabled: data.enabled,
  });

  props.handleClose();
}
</script>

<template>
  <Form
    v-slot="{ handleSubmit, values }"
    as=""
    :keep-values="false"
    :initial-values="{
      title: data?.title,
      description: data?.description,
      link: data?.link,
      icon_url: data?.icon_url,
      icon_wrap: data?.icon_wrap,
      enabled: data?.enabled ?? true,
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

          <FormField
            v-slot="{ componentField }"
            name="description"
          >
            <FormItem>
              <FormLabel>Beschreibung</FormLabel>
              <FormControl>
                <Textarea
                  autocomplete="off"
                  v-bind="componentField"
                ></Textarea>
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="link"
          >
            <FormItem>
              <FormLabel>Link</FormLabel>
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
            v-slot="{ componentField, value }"
            name="icon_url"
          >
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <div class="flex items-center gap-2">
                  <ServiceIcon
                    :url="value"
                    :wrap="values.icon_wrap"
                  />
                  <Input
                    type="text"
                    autocomplete="off"
                    placeholder="URL"
                    v-bind="componentField"
                  />
                </div>
              </FormControl>
              <FormDescription>
                Tip: Nutze
                <a
                  class="underline"
                  href="https://dashboardicons.com/icons"
                  target="_blank"
                  >dashboardicons.com</a
                >
              </FormDescription>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ value, handleChange }"
            name="icon_wrap"
          >
            <FormItem>
              <FormLabel>Icon wrap</FormLabel>
              <FormControl>
                <Switch
                  :model-value="value"
                  @update:model-value="handleChange"
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ value, handleChange }"
            name="enabled"
          >
            <FormItem>
              <FormLabel>Enabled</FormLabel>
              <FormControl>
                <Switch
                  :model-value="value"
                  @update:model-value="handleChange"
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
