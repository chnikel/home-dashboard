<script setup lang="ts">
import {
  CheckIcon,
  CircleXIcon,
  FilePlusIcon,
  FolderIcon,
  PenIcon,
  PlusIcon,
  SaveIcon,
  SearchIcon,
  TagIcon,
} from "lucide-vue-next";
import InputGroup from "./ui/input-group/InputGroup.vue";
import InputGroupAddon from "./ui/input-group/InputGroupAddon.vue";
import InputGroupInput from "./ui/input-group/InputGroupInput.vue";
import InputGroupButton from "./ui/input-group/InputGroupButton.vue";
import Button from "./ui/button/Button.vue";
import DropdownMenu from "./ui/dropdown-menu/DropdownMenu.vue";
import DropdownMenuTrigger from "./ui/dropdown-menu/DropdownMenuTrigger.vue";
import DropdownMenuContent from "./ui/dropdown-menu/DropdownMenuContent.vue";
import DropdownMenuItem from "./ui/dropdown-menu/DropdownMenuItem.vue";
import DropdownMenuSeparator from "./ui/dropdown-menu/DropdownMenuSeparator.vue";

const emit = defineEmits<{
  (e: "addService"): void;
  (e: "addGroup"): void;
  (e: "addTags"): void;
  (e: "saveSearch"): void;
}>();

const isEditMode = defineModel("editMode");
const searchText = defineModel("searchText");

const props = defineProps<{
  disableSaveSearch: boolean;
}>();
</script>

<template>
  <div class="border-b">
    <div
      class="p-4 grid grid-cols-2 sm:grid-cols-[1fr_2fr_1fr] gap-2 shadow-lg justify-between pb-4 container mx-auto max-w-6xl"
    >
      <div class="items-center hidden sm:flex">HomeLinker</div>

      <div class="flex gap-1 sm:justify-self-center">
        <InputGroup class="w-60 sm:w-80 ml-auto md:ml-0">
          <InputGroupInput
            v-model="searchText"
            placeholder="Search name, description or #tag"
            @keydown.enter="emit('saveSearch')"
          />
          <InputGroupAddon>
            <SearchIcon v-if="!searchText" />
            <InputGroupButton
              v-else
              size="icon-xs"
              @click="searchText = ''"
            >
              <CircleXIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <Button
          size="icon"
          variant="outline"
          :disabled="disableSaveSearch"
          @click="emit('saveSearch')"
        >
          <SaveIcon />
        </Button>
      </div>

      <div class="space-x-2 justify-self-end">
        <Button
          v-if="!isEditMode"
          variant="outline"
          @click="isEditMode = true"
        >
          <PenIcon />
          <span class="text-white hidden md:inline">Bearbeiten</span>
        </Button>
        <DropdownMenu v-if="isEditMode">
          <DropdownMenuTrigger>
            <Button>
              <PlusIcon />
              <span class="hidden md:inline">Hinzufügen</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem @click="emit('addService')">
              <FilePlusIcon /> Service hinzufügen
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="emit('addGroup')">
              <FolderIcon /> Gruppe hinzufügen
            </DropdownMenuItem>
            <DropdownMenuItem @click="emit('addTags')">
              <TagIcon /> Tag hinzufügen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          v-if="isEditMode"
          class="!bg-orange-500"
          @click="isEditMode = false"
        >
          <CheckIcon color="white" />
          <span class="text-white hidden md:inline">Fertig</span>
        </Button>
      </div>
    </div>
  </div>
</template>
