<script setup lang="ts">
import type { GetTagsResponse } from "@/api";
import PageContent from "@/components/PageContent.vue";
import ServiceAppLayout from "@/components/ServiceAppLayout.vue";
import ServiceIcon from "@/components/ServiceIcon.vue";
import Tag from "@/components/Tag.vue";
import ToolBar from "@/components/ToolBar.vue";
import Badge from "@/components/ui/badge/Badge.vue";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import FormControl from "@/components/ui/form/FormControl.vue";
import FormDescription from "@/components/ui/form/FormDescription.vue";
import FormItem from "@/components/ui/form/FormItem.vue";
import FormLabel from "@/components/ui/form/FormLabel.vue";
import InputGroup from "@/components/ui/input-group/InputGroup.vue";
import InputGroupAddon from "@/components/ui/input-group/InputGroupAddon.vue";
import InputGroupInput from "@/components/ui/input-group/InputGroupInput.vue";
import Input from "@/components/ui/input/Input.vue";
import { Select } from "@/components/ui/select";
import SelectContent from "@/components/ui/select/SelectContent.vue";
import SelectGroup from "@/components/ui/select/SelectGroup.vue";
import SelectItem from "@/components/ui/select/SelectItem.vue";
import SelectTrigger from "@/components/ui/select/SelectTrigger.vue";
import SelectValue from "@/components/ui/select/SelectValue.vue";
import { Separator } from "@/components/ui/separator";
import Switch from "@/components/ui/switch/Switch.vue";
import Textarea from "@/components/ui/textarea/Textarea.vue";
import { useGroups } from "@/composables/group";
import { useTags } from "@/composables/tag";
import ServiceRepository from "@/repositories/ServiceRepository";
import { toTypedSchema } from "@vee-validate/zod";
import {
  ChevronLeftIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  GroupIcon,
  PlusIcon,
  XIcon,
} from "lucide-vue-next";
import { useForm } from "vee-validate";
import { computed, useTemplateRef } from "vue";
import { useRouter } from "vue-router";
import z from "zod";

const router = useRouter();

const ServiceDialogFormData = z.object({
  title: z.string(),
  description: z.string().optional().default(""),
  link: z.string().optional().default(""),
  icon_url: z.string().optional().default(""),
  icon_wrap: z.boolean().optional().default(false),
  enabled: z.boolean().default(true),
  groupId: z.number().optional().nullable(),
  tagIds: z.array(z.number()).optional(),
  bgColor: z.string().optional().default(""),
});

export type ServiceDialogFormData = z.infer<typeof ServiceDialogFormData>;

const formSchema = toTypedSchema(ServiceDialogFormData);

const form = useForm<ServiceDialogFormData>({
  validationSchema: formSchema,
});

const onAddService = async (data: ServiceDialogFormData) => {
  const tags = (data.tagIds || []).reduce<string[]>((acc, id) => {
    const tag = findTag(id);
    if (tag) {
      acc.push(tag.name);
    }

    return acc;
  }, []);

  try {
    await ServiceRepository.create({
      title: data.title,
      description: data.description,
      link: data.link,
      icon_url: data.icon_url,
      icon_wrap: data.icon_wrap,
      enabled: data.enabled,
      groupId: data.groupId,
      tags,
      bgColor: data.bgColor,
    });
  } catch (error) {
    console.log(error);
  }

  goBack();
};

const goBack = () => {
  router.push({ name: "apps" });
};

const onSubmit = form.handleSubmit((values) => {
  onAddService(values);
});

const { groups, isLoading: isFetchingGroups } = useGroups();
const { tags, isLoading: isFetchingTags } = useTags();

const filteredTags = computed(() => {
  return (tags.value || []).filter((tag) => {
    return !(form.values.tagIds || []).includes(tag.id);
  });
});

function findTag(id: number) {
  return (tags.value || []).find((t) => {
    return t.id === id;
  });
}

function onTagChange(tag: GetTagsResponse) {
  const currentTagIds = form.values.tagIds || [];

  if (tag) {
    form.setFieldValue("tagIds", [...currentTagIds, tag.id]);
  }
}

function handleTagRemove(id: number) {
  const currentTagIds = form.values.tagIds || [];
  form.setFieldValue(
    "tagIds",
    currentTagIds.filter((tagId) => tagId !== id),
  );
}

const serviceTags = computed(() => {
  const tagIds = form.values.tagIds || [];
  return tagIds.reduce<GetTagsResponse[]>((acc, id) => {
    const tag = findTag(id);
    if (tag) {
      acc.push(tag);
    }

    return acc;
  }, []);
});

const customColorInput = useTemplateRef("custom-color");
const suggestedColors = ["#ffffff", "#000000", "#3b3b3b"];
</script>

<template>
  <form
    id="form"
    @submit="onSubmit"
  >
    <ToolBar
      class="sticky top-0 bg-neutral-950 z-10 grid-cols-2 sm:grid-cols-3"
      content-class="grid-cols-2"
    >
      <div class="flex items-center gap-3">
        <Button
          variant="outline"
          class="cursor-pointer"
          @click="goBack()"
          size="icon"
        >
          <ChevronLeftIcon />
        </Button>
        <div class="flex gap-2">
          <ServiceIcon
            class="!size-12 rounded-xl"
            :url="form.values.icon_url"
            :bg-color="form.values.bgColor"
            :boxed="true"
            :wrap="form.values.icon_wrap"
          />
          <div class="overflow-hidden m-2">
            <div
              class="text-blue-300 text-sm text-nowrap overflow-ellipsis overflow-hidden"
            >
              <div class="grid grid-cols-[1fr_auto] items-center gap-1">
                <div class="overflow-ellipsis overflow-hidden">
                  {{ form.values.title || "---" }}
                </div>
              </div>
            </div>
            <div class="flex items-center">
              <div
                class="text-sm text-neutral-300 text-nowrap overflow-ellipsis overflow-hidden"
              >
                {{ form.values.description || "---" }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-1 sm:gap-3 justify-self-end">
        <Button type="submit">
          <PlusIcon />
          <span class="hidden sm:inline">Hinzufügen</span>
        </Button>
        <Button
          type="button"
          variant="secondary"
          @click="goBack()"
        >
          <XIcon />
          <span class="hidden sm:inline">Abbrechen</span>
        </Button>
      </div>
    </ToolBar>

    <PageContent class="p-4 grid gap-2 items-center grid-cols-2">
      <div class="justify-self-start">
        <h2 class="text-lg">
          Neuen Service hinzufügen
        </h2>
      </div>
      <div class="flex items-center gap-3 justify-self-end">
        <FormField
          v-slot="{ value, setValue }"
          name="enabled"
        >
          <FormItem>
            <FormControl>
              <Button
                class="cursor-pointer"
                type="button"
                variant="outline"
                @click="setValue(!value)"
              >
                <template v-if="value">
                  <EyeOffIcon />
                  <span class="hidden md:inline">Verstecken</span>
                </template>
                <template v-else>
                  <EyeIcon />
                  <span class="hidden md:inline">Anzeigen</span>
                </template>
              </Button>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="groupId"
        >
          <FormItem>
            <FormControl>
              <div v-if="isFetchingGroups">Gruppen werden geladen...</div>

              <Select
                v-else
                v-bind="componentField"
              >
                <SelectTrigger class="w-full">
                  <GroupIcon />
                  <SelectValue placeholder="Keine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="group in groups"
                      :value="Number(group.id)"
                    >
                      {{ group.title || "-" }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
      </div>
    </PageContent>
    <PageContent class="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
      <div class="space-y-8 px-4 overflow-auto max-w-xl">
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
              />
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
        <Separator class="my-6" />
        <FormField
          v-slot="{ componentField }"
          name="icon_url"
        >
          <FormItem>
            <FormLabel>Icon (URL)</FormLabel>
            <FormControl>
              <div class="flex items-center gap-2">
                <Input
                  type="text"
                  autocomplete="off"
                  placeholder="URL"
                  v-bind="componentField"
                />
              </div>
            </FormControl>
            <FormDescription>
              Tipp: Nutze
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
          v-slot="{ value, setValue }"
          name="icon_wrap"
        >
          <FormItem>
            <FormLabel>Abstand auswählen</FormLabel>
            <FormControl>
              <div class="flex gap-3">
                <ServiceIcon
                  :url="form.values.icon_url"
                  :bg-color="form.values.bgColor"
                  :boxed="true"
                  :wrap="false"
                  :class="{
                    'outline-4 outline-blue-500': !value,
                  }"
                  @click="setValue(false)"
                />
                <ServiceIcon
                  :url="form.values.icon_url"
                  :bg-color="form.values.bgColor"
                  :boxed="true"
                  :wrap="true"
                  :class="{
                    'outline-4 outline-blue-500': value,
                  }"
                  @click="setValue(true)"
                />
              </div>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField, setValue, value }"
          name="bgColor"
        >
          <FormItem>
            <FormLabel>Hintergrundfarbe</FormLabel>
            <FormControl>
              <div class="flex gap-3">
                <template v-for="color in suggestedColors">
                  <ServiceIcon
                    v-if="color !== form.values.bgColor"
                    :url="form.values.icon_url"
                    :bg-color="form.values.bgColor"
                    :boxed="true"
                    :wrap="form.values.icon_wrap"
                    :style="`background-color: ${color};`"
                    :class="{
                      'outline-4 outline-blue-500': value === color,
                    }"
                    @click="setValue(color)"
                  />
                </template>

                <ServiceIcon
                  v-if="form.values.bgColor"
                  :url="form.values.icon_url"
                  :bg-color="form.values.bgColor"
                  :boxed="true"
                  :wrap="form.values.icon_wrap"
                  :class="{
                    'outline-4 outline-blue-500': value == form.values.bgColor,
                    'outline-4 outline-yellow-500':
                      value != form.values.bgColor,
                  }"
                  @click="setValue(form.values.bgColor || '')"
                />

                <Separator
                  orientation="vertical"
                  class="ml-auto"
                />

                <ServiceIcon
                  :url="form.values.icon_url"
                  :bg-color="form.values.bgColor"
                  :boxed="true"
                  :wrap="form.values.icon_wrap"
                  @click="customColorInput?.$el.click()"
                />
              </div>

              <InputGroup class="mt-1">
                <InputGroupInput
                  type="text"
                  v-bind="componentField"
                />
                <InputGroupAddon>
                  <InputGroupInput
                    ref="custom-color"
                    class="w-20"
                    type="color"
                    v-bind="componentField"
                  />
                </InputGroupAddon>
              </InputGroup>
            </FormControl>
          </FormItem>
        </FormField>
        <Separator class="my-6" />
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
              <div v-if="isFetchingGroups">Gruppen werden geladen...</div>
              <Select
                v-else
                v-bind="componentField"
              >
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Keine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="group in groups"
                      :value="Number(group.id)"
                    >
                      {{ group.title || "-" }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="tagIds">
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <div class="grid grid-cols-2 gap-3">
              <div
                class="relative border-input rounded-md border bg-transparent px-3 py-2 shadow-xs md:text-sm min-h-40 space-y-3"
              >
                <Tag
                  v-for="tag in serviceTags"
                  class="cursor-pointer"
                  :name="tag.name"
                  :color="tag.color"
                  :action="true"
                  @click="() => handleTagRemove(tag.id)"
                />
                <span
                  class="text-muted-foreground"
                  v-if="serviceTags.length === 0"
                >
                  Keine Tags ausgewählt.
                </span>
                <div
                  class="-z-10 absolute inset-0 grid place-content-center text-muted font-bold text-xl"
                >
                  Ausgewählt
                </div>
              </div>
              <div
                class="relative border-input rounded-md border bg-transparent px-3 py-2 shadow-xs md:text-sm min-h-40 space-y-3"
              >
                <Tag
                  v-for="tag in filteredTags"
                  class="cursor-pointer"
                  :name="tag.name"
                  :color="tag.color"
                  @click="onTagChange(tag)"
                />
                <span
                  class="text-muted-foreground"
                  v-if="isFetchingTags"
                >
                  Tags werden geladen...
                </span>
                <span
                  class="text-muted-foreground"
                  v-else-if="filteredTags.length === 0"
                >
                  Keine Tags verfügbar.
                </span>
                <div
                  class="-z-10 absolute inset-0 grid place-content-center text-muted font-bold text-xl"
                >
                  Verfügbar
                </div>
              </div>
            </div>
          </FormItem>
        </FormField>
      </div>

      <div class="space-y-8 mt-8 sm:mt-0 px-4">
        <div class="flex flex-wrap border rounded-lg py-6 px-3">
          <ServiceAppLayout
            class="mx-auto w-[100px]"
            :data="{
              id: 0,
              title: form.values.title || '',
              description: form.values.description || '',
              icon_url: form.values.icon_url || '',
              icon_wrap: form.values.icon_wrap || false,
              tags: [],
              bgColor: form.values.bgColor || '',
              enabled: form.values.enabled || false,
              link: '',
              groupId: -1,
            }"
          />
        </div>

        <div>
          <code
            class="border-input dark:bg-input/30 flex min-h-16 rounded-md border bg-transparent px-3 py-2 shadow-xs md:text-sm"
          >
            <pre class="overflow-auto">{{ form.values }}</pre>
          </code>
        </div>
      </div>
    </PageContent>
  </form>
</template>
