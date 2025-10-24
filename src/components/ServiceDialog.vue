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
import { findTag, store, updateLocalTags } from "@/store";
import { useForm } from "vee-validate";
import { computed, onBeforeMount, ref } from "vue";
import Tag from "./Tag.vue";
import type { GetTagsResponse } from "@/api";
import { ExternalLinkIcon } from "lucide-vue-next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ServiceDialogFormData = z.object({
  title: z.string(),
  description: z.string().optional().default(""),
  link: z.string().optional().default(""),
  icon_url: z.string().optional().default(""),
  icon_wrap: z.boolean().optional().default(false),
  enabled: z.boolean().default(true),
  groupId: z.number().optional().nullable(),
  tagIds: z.array(z.number()).optional(),
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
        tagIds: props.data?.tagIds,
      }
    : undefined,
});

const onSubmit = form.handleSubmit((values) => {
  emit("submit", values as ServiceDialogFormData);

  props.handleClose();
});

onBeforeMount(() => {
  updateLocalTags();
});

const filteredTags = computed(() => {
  return store.tags.filter((tag) => {
    return !(form.values.tagIds || []).includes(tag.id);
  });
});

const tags = computed(() => {
  const tagIds = form.values.tagIds || [];
  return tagIds.reduce<GetTagsResponse[]>((acc, id) => {
    const tag = findTag(id);
    if (tag) {
      acc.push(tag);
    }

    return acc;
  }, []);
});

const tagToAdd = ref("");

function onTagChange() {
  const tagId = Number(tagToAdd.value);
  const currentTagIds = form.values.tagIds || [];
  const tag = findTag(tagId);

  if (tag) {
    form.setFieldValue("tagIds", [...currentTagIds, tagId]);
  }

  tagToAdd.value = "";
}

function handleTagRemove(id: number) {
  const currentTagIds = form.values.tagIds || [];
  form.setFieldValue(
    "tagIds",
    currentTagIds.filter((tagId) => tagId !== id)
  );
}
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
        <Tabs default-value="general">
          <TabsList class="w-full">
            <TabsTrigger value="general"> General </TabsTrigger>
            <TabsTrigger value="appearance"> Design </TabsTrigger>
            <TabsTrigger value="dwa"> Design </TabsTrigger>
          </TabsList>
          <TabsContent value="general">
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
          </TabsContent>
          <TabsContent value="appearance">
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
                      :wrap="form.values.icon_wrap"
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
                    class="inline-flex items-center gap-0.5 hover:text-white"
                    :href="`https://dashboardicons.com/icons?q=${form.values.title}`"
                    target="_blank"
                  >
                    <span class="underline">dashboardicons.com</span>
                    <ExternalLinkIcon :size="16" />
                  </a>
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
          </TabsContent>

          <TabsContent value="dwa">
            <FormField name="tagIds">
              <FormItem>
                <FormLabel>Tags</FormLabel>

                <div>
                  <Tag
                    v-for="tag in tags"
                    :name="tag.name"
                    :color="tag.color"
                    :action="true"
                    @action="() => handleTagRemove(tag.id)"
                  />
                </div>

                <FormControl>
                  <Select
                    v-model="tagToAdd"
                    @update:model-value="onTagChange"
                  >
                    <FormControl>
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          v-for="tag in filteredTags"
                          :value="tag.id"
                        >
                          <Tag
                            :name="tag.name"
                            :color="tag.color"
                          />
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
          </TabsContent>
        </Tabs>

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
