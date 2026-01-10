<script setup lang="ts">
import { deleteService, host } from "@/api";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const services = ref<any>([]);

const getSoftDeletedServices = async () => {
  const response = await fetch(`${host}/api/services?deleted=true`);

  const data = await response.json();

  services.value = data;
};

onMounted(async () => {
  await getSoftDeletedServices();
});

const handleDeleteClick = async (id: number) => {
  await deleteService(id, true).then(() => {
    getSoftDeletedServices();
  });
};
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
          <Dialog>
            <DialogTrigger as-child>
              <Button
                variant="outline"
                size="sm"
              >
                Rückgängig
              </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Aktion erforderlich</DialogTitle>
                <DialogDescription>
                  Soll die Löschung des Services rückgängig gemacht werden?
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <DialogClose as-child>
                  <Button variant="outline"> Abbrechen </Button>
                </DialogClose>
                <Button type="submit"> Rückgängig machen </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger as-child>
              <Button
                variant="destructive"
                size="sm"
              >
                Löschen
              </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Aktion erforderlich</DialogTitle>
                <DialogDescription>
                  Soll der Service unwiderruflich gelöscht werden?
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <DialogClose as-child>
                  <Button variant="outline"> Abbrechen </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  @click="handleDeleteClick(service.id)"
                >
                  Unwiderruflich löschen
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ItemActions>
      </Item>
    </div>
  </div>
</template>
