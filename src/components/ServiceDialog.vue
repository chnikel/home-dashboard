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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { store } from "@/store";
import { useForm } from "vee-validate";

const ServiceDialogFormData = z.object({
  title: z.string(),
  description: z.string().optional().default(""),
  link: z.string().optional().default(""),
  icon_url: z.string().optional().default(""),
  icon_wrap: z.boolean().optional().default(false),
  enabled: z.boolean().default(true),
  groupId: z.number().optional().nullable(),
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

const form = useForm({
  validationSchema: formSchema,
  initialValues: props.data
    ? {
        title: props.data?.title,
        description: props.data?.description,
        link: props.data?.link,
        icon_url: props.data?.icon_url,
        icon_wrap: props.data?.icon_wrap,
        enabled: props.data?.enabled ?? true,
        groupId: props.data?.groupId,
      }
    : undefined,
});

const onSubmit = form.handleSubmit((values) => {
  emit("submit", values as ServiceDialogFormData);

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
                  :wrap="value?.icon_wrap"
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
                :href="`https://dashboardicons.com/icons?q=${value?.title}`"
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

        <FormField
          v-slot="{ componentField }"
          name="groupId"
        >
          <FormItem>
            <FormLabel>Gruppe</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="group in store.groups"
                      :value="group.id"
                    >
                      {{ group.title || "Keine Gruppe" }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
