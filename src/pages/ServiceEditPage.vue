<script setup lang="ts">
import type { GetTagsResponse } from "@/api";
import Header from "@/components/Header.vue";
import PageContent from "@/components/PageContent.vue";
import ServiceAppLayout from "@/components/ServiceAppLayout.vue";
import ServiceIcon from "@/components/ServiceIcon.vue";
import ServiceTags from "@/components/ServiceTags.vue";
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
import Toggle from "@/components/ui/toggle/Toggle.vue";
import { TooltipProvider } from "@/components/ui/tooltip";
import Tooltip from "@/components/ui/tooltip/Tooltip.vue";
import TooltipContent from "@/components/ui/tooltip/TooltipContent.vue";
import TooltipTrigger from "@/components/ui/tooltip/TooltipTrigger.vue";
import { useGroups } from "@/composables/group";
import { usePinnedServices } from "@/composables/pinned-service";
import { useService } from "@/composables/service";
import { useTags } from "@/composables/tag";
import ServiceRepository from "@/repositories/ServiceRepository";
import { toTypedSchema } from "@vee-validate/zod";
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  GroupIcon,
  LoaderCircleIcon,
} from "lucide-vue-next";
import { useForm } from "vee-validate";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import z from "zod";

const router = useRouter();
const route = useRoute();

const { service: serviceData, isLoading: isServiceLoading } = useService(
  route.params.id as string,
);

onMounted(async () => {
  const service = await ServiceRepository.getById(route.params.id as string);

  if (!service) {
    return;
  }

  form.setValues({
    title: service.title,
    description: service.description,
    link: service.link,
    icon_url: service.icon_url,
    icon_wrap: service.icon_wrap,
    enabled: service.enabled ?? true,
    groupId: service.groupId,
    tagIds: service.tags.map((tag) => tag.id),
    bgColor: service.bgColor || "",
  });
});

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

const emit = defineEmits<{
  (e: "submit", data: ServiceDialogFormData): void;
}>();

const formSchema = toTypedSchema(ServiceDialogFormData);

const form = useForm<ServiceDialogFormData>({
  validationSchema: formSchema,
});

const onEditService = async (data: ServiceDialogFormData) => {
  const tags = (data.tagIds || []).reduce<string[]>((acc, id) => {
    const tag = findTag(id);
    if (tag) {
      acc.push(tag.name);
    }

    return acc;
  }, []);

  try {
    await ServiceRepository.update(route.params.id as string, {
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
  onEditService(values);
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

const { isPinned } = usePinnedServices();
</script>

<template>
  <form
    id="form"
    @submit="onSubmit"
  >
    <div
      v-if="isServiceLoading"
      class="absolute inset-0 bg-neutral-800/80 z-40 flex items-center justify-center"
    >
      <LoaderCircleIcon class="animate-spin" />
    </div>
    <div class="border-b">
      <PageContent class="p-4">
        <div class="flex gap-2">
          <ServiceIcon
            class="!size-12 rounded-xl"
            :url="serviceData?.icon_url"
            :bg-color="serviceData?.bgColor"
            :boxed="true"
          />

          <div class="overflow-hidden m-2">
            <div
              class="text-blue-300 text-sm text-nowrap overflow-ellipsis overflow-hidden"
            >
              <div class="grid grid-cols-[1fr_auto] items-center gap-1">
                <div class="overflow-ellipsis overflow-hidden">
                  {{ serviceData?.title }}
                </div>
              </div>
            </div>

            <div
              v-if="serviceData?.description.trim()"
              class="flex items-center mt-1"
            >
              <div
                class="text-sm text-neutral-300 text-nowrap overflow-ellipsis overflow-hidden"
              >
                {{ serviceData?.description }}
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </div>

    <ToolBar class="relative sm:sticky top-0 bg-neutral-950 z-10">
      <template #start>
        <div class="flex gap-3 items-center">
          <Button
            variant="outline"
            class="cursor-pointer"
            @click="goBack()"
          >
            <ArrowLeftIcon />
            Zurück
          </Button>
          <Badge
            v-if="!form.values.enabled"
            class="bg-orange-300"
          >
            Versteckt
          </Badge>
          <Badge
            v-if="serviceData ? isPinned(serviceData.id.toString()) : false"
            class="bg-blue-500 text-white"
          >
            Angeheftet
          </Badge>
        </div>
      </template>

      <template #center>
        <div class="flex items-center gap-3">
          <Button type="submit"> Speichern </Button>
          <Button
            type="button"
            variant="secondary"
            @click="goBack()"
          >
            Abbrechen
          </Button>
        </div>
      </template>

      <template #end>
        <div class="flex items-center gap-3 justify-self-end">
          <FormField
            v-slot="{ value, setValue }"
            name="enabled"
          >
            <FormItem>
              <FormControl>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <Toggle
                        class="cursor-pointer"
                        variant="outline"
                        @click="setValue(!value)"
                      >
                        <EyeIcon v-if="value" />
                        <EyeOffIcon v-else />
                      </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p v-if="value">Verstecken</p>
                      <p v-else>Anzeigen</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                    <SelectValue placeholder="" />
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
      </template>
    </ToolBar>
    <PageContent class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 pt-4">
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
          v-slot="{ componentField }"
          name="bgColor"
        >
          <FormItem>
            <FormLabel>Hintergrundfarbe</FormLabel>
            <FormControl>
              <InputGroup>
                <InputGroupInput
                  type="text"
                  v-bind="componentField"
                />
                <InputGroupAddon>
                  <InputGroupInput
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
                  <SelectValue placeholder="" />
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

        <div
          class="border-b pb-6 border-solid border-inherit flex overflow-hidden"
        >
          <ServiceTags
            class="flex overflow-auto"
            style="scrollbar-width: none"
            :tags="serviceData?.tags || []"
            :max="8"
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
