<script setup lang="ts">
import { host } from "@/api";
import ServiceIcon from "@/components/ServiceIcon.vue";
import Button from "@/components/ui/button/Button.vue";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import ItemDescription from "@/components/ui/item/ItemDescription.vue";
import ItemMedia from "@/components/ui/item/ItemMedia.vue";
import { onMounted, ref } from "vue";

const services = ref<any>([]);

const getSoftDeletedServices = async () => {
  const response = await fetch(`${host}/api/services?deleted=true`);

  const data = await response.json();

  services.value = data;
};

onMounted(async () => {
  await getSoftDeletedServices();
});
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 px-4 py-10">
    <h2 class="text-xl">Gelöschte Services</h2>
    <div class="mx-auto w-full max-w-3xl flex flex-col gap-3">
      <Item
        v-for="service in services"
        variant="outline"
      >
        <ItemMedia>
          <ServiceIcon
            :url="service.iconUrl"
            :wrap="service.iconWrap"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            {{ service.title }}
          </ItemTitle>
          <ItemDescription>
            {{ service.description }}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="outline"
            size="sm"
          >
            Rückgängig
          </Button>
          <Button
            variant="destructive"
            size="sm"
          >
            Löschen
          </Button>
        </ItemActions>
      </Item>
    </div>
  </div>
</template>
