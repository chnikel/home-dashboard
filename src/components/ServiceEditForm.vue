<script setup lang="ts">
import { ref, watch } from "vue";
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
import Select from "./ui/select/Select.vue";
import type { ServiceTag } from "@/api";
import Switch from "./ui/switch/Switch.vue";
import Label from "./ui/label/Label.vue";
import SelectItem from "./ui/select/SelectItem.vue";
import { useGroups } from "@/composables/useGroups";

export type SubmitData = {
  title: string;
  description: string;
  link: string;
  icon_url: string;
  icon_wrap: boolean;
  enabled: boolean;
  groupId: number | null;
  tags: Omit<ServiceTag, "id">[];
};

const props = defineProps<{
  initial?: Partial<SubmitData>;
  buttonText: string;
  submitText: string;
}>();

const emit = defineEmits<{
  (e: "submit", data: SubmitData): void;
}>();

const formSchema = toTypedSchema(
  z.object({
    title: z.string().default(props.initial?.title || ""),
    description: z
      .string()
      .optional()
      .default(props.initial?.description || ""),
    link: z.string().default(props.initial?.link || ""),
    icon_url: z
      .string()
      .optional()
      .default(props.initial?.icon_url || ""),
    icon_wrap: z.boolean().default(props.initial?.icon_wrap || false),
    enabled: z.boolean().default(props.initial?.enabled || true),
    groupId: z
      .string()
      .optional()
      .default(props.initial?.groupId?.toString() || ""),
    tags: z
      .array(
        z.object({
          name: z.string(),
          color: z.string(),
        })
      )
      .optional()
      .default(props.initial?.tags || []),
  })
);

function onSubmit(values: any) {
  emit("submit", values);

  isOpen.value = false;
}
const isOpen = ref(false);

const { groups } = useGroups();
</script>

<template>
  <Form
    v-slot="{ handleSubmit }"
    as=""
    keep-values
    :validation-schema="formSchema"
  >
    <Dialog :open="isOpen">
      <DialogTrigger as-child>
        <Button
          @click="isOpen = true"
        >
          {{ buttonText }}
        </Button>
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
              <FormLabel>Title</FormLabel>
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
            name="description"
          >
            <FormItem>
              <FormLabel>Description</FormLabel>
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
            name="link"
          >
            <FormItem>
              <FormLabel>Link</FormLabel>
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
            name="icon_url"
          >
            <FormItem>
              <FormLabel>Icon url</FormLabel>
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
            v-slot="{ value, handleChange }"
            name="icon_wrap"
          >
            <FormItem>
              <FormControl>
                <div class="flex items-center space-x-2">
                  <Switch
                    id="icon-wrap"
                    :model-value="value"
                    @update:model-value="handleChange"
                  />
                  <Label for="icon-wrap">Icon wrap</Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ value, handleChange }"
            name="enabled"
          >
            <FormItem>
              <FormControl>
                <div class="flex items-center space-x-2">
                  <Switch
                    id="enabled"
                    :model-value="value"
                    @update:model-value="handleChange"
                  />
                  <Label for="enabled">Enabled</Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="groupId"
          >
            <FormItem>
              <FormLabel>Gruppe</FormLabel>

              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Wähle eine Farbe für dein Tag" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="group in groups"
                      :value="group.id || '-1'"
                    >
                      {{ group.title || "Keine Gruppe" }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>

        <DialogFooter>
          <Button
            type="submit"
            form="dialogForm"
          >
            {{ submitText }}
          </Button>
          <Button
            type="button"
            variant="secondary"
            @click="isOpen = false"
          >
            Abbrechen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Form>
</template>
