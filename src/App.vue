<script setup lang="ts">
import { onMounted, ref } from "vue";
import Service from "./components/Service.vue";
import {
  addGroup,
  addService,
  addTag,
  deleteGroup,
  deleteService,
  getServiceGroups,
  type GetServiceGroupsResponse,
  type GetServicesResponse,
} from "./api";
import ServiceEditForm, {
  type SubmitData,
} from "./components/ServiceEditForm.vue";
import EditServiceWrapper from "./components/EditServiceWrapper.vue";
import ServiceGroup from "./components/ServiceGroup.vue";
import type { AddGroupSubmitData } from "./components/GroupEditForm.vue";
import GroupEditForm from "./components/GroupEditForm.vue";
import TagEditForm, {
  type AddTagSubmitData,
} from "./components/TagEditForm.vue";
import Button from "./components/ui/button/Button.vue";

const groups = ref<GetServiceGroupsResponse[] | null>(null);

onMounted(async () => {
  groups.value = await getServiceGroups();
});

const handleAddService = async (data: SubmitData) => {
  const tags = data.tags.map((t) => t.name);

  try {
    await addService({
      title: data.title,
      description: data.description,
      link: data.link,
      icon_url: data.icon_url,
      icon_wrap: data.icon_wrap,
      enabled: data.enabled,
      groupId: data.groupId,
      tags,
    });
  } catch (error) {
    console.log(error);
  }

  groups.value = await getServiceGroups();
};

const isEditMode = ref(false);
const toggleEdit = () => (isEditMode.value = !isEditMode.value);

const editService = async () => {
  groups.value = await getServiceGroups();
};

const handleDeleteService = async (service: GetServicesResponse) => {
  if (confirm("Service löschen?")) {
    try {
      await deleteService(service.id);
    } catch (error) {
      console.log(error);
    }

    groups.value = await getServiceGroups();
  }
};

const handleAddGroup = async (data: AddGroupSubmitData) => {
  try {
    await addGroup(data);
  } catch (error) {
    console.log(error);
  }

  groups.value = await getServiceGroups();
};

const handleEditGroup = async () => {
  groups.value = await getServiceGroups();
};

const handleDeleteGroup = async (groupId: number) => {
  if (confirm("Gruppe löschen?")) {
    try {
      await deleteGroup(groupId);
    } catch (error) {
      console.log(error);
    }

    groups.value = await getServiceGroups();
  }
};

const afterMove = async () => {
  groups.value = await getServiceGroups();
};

const handleAddTag = async (data: AddTagSubmitData) => {
  try {
    await addTag(data);
  } catch (error) {
    console.log(error);
  }

  groups.value = await getServiceGroups();
};
</script>

<template>
  <div class="h-screen p-3">
    <div class="container mx-auto">
      <div class="space-x-2 mb-6 flex justify-end">
        <template v-if="isEditMode">
          <ServiceEditForm
            buttonText="Service hinzufügen"
            submitText="Hinzufügen"
            @submit="handleAddService($event)"
          />
          <GroupEditForm
            button-text="Gruppe hinzufügen"
            submit-text="Hinzufügen"
            @submit="handleAddGroup($event)"
          />
          <TagEditForm @submit="handleAddTag($event)" />
        </template>
        <Button
          @click="toggleEdit()"
          :class="{
            '!bg-orange-500': isEditMode,
          }"
        >
          {{ isEditMode ? "Bearbeiten beenden" : "Bearbeiten" }}
        </Button>
      </div>

      <template v-for="group in groups">
        <ServiceGroup
          v-if="group.services.length > 0 || isEditMode"
          :group="group"
          :edit="isEditMode"
          :title="group.id == null ? 'Keine Gruppe' : group.title"
          @edit="handleEditGroup()"
          @delete="handleDeleteGroup(group.id || -1)"
          @move="afterMove()"
        >
          <template v-for="service in group.services">
            <EditServiceWrapper
              v-if="service.enabled || isEditMode"
              :draggable="isEditMode"
              :service="service"
              :edit="isEditMode"
              @edit="editService()"
              @delete="handleDeleteService(service)"
            >
              <Service
                :id="'service' + service.id"
                :title="service.title"
                :description="service.description"
                :link="service.link"
                :icon_url="service.icon_url"
                :icon_wrap="service.icon_wrap"
                :tags="service.tags"
              />
            </EditServiceWrapper>
          </template>
        </ServiceGroup>
      </template>
    </div>
  </div>
</template>
