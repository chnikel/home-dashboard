<script setup lang="ts">
import Header from "@/components/Header.vue";
import Page from "@/components/Page.vue";
import PageContent from "@/components/PageContent.vue";
import { useTags } from "@/composables/tag";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Tag from "@/components/Tag.vue";
import { computed } from "vue";
import { useServices } from "@/composables/service";
import Badge from "@/components/ui/badge/Badge.vue";
import Button from "@/components/ui/button/Button.vue";
import { PenIcon, TrashIcon } from "lucide-vue-next";
import TagRepository from "@/repositories/TagRepository";

const { services } = useServices();
const { tags } = useTags();

const sortedTags = computed(() =>
  tags.value.sort((a, b) => {
    return b.weight - a.weight;
  }),
);

const tableData = computed(() =>
  sortedTags.value.map((row) => {
    return {
      ...row,
      services: services.value?.filter(
        (service) => service.tags.findIndex((t) => t.id === row.id) !== -1,
      ),
    };
  }),
);

const deleteTag = (tagId: number) => {

  TagRepository.delete(tagId)

}
</script>

<template>
  <Page>
    <Header />

    <PageContent>
      <Table>
        <TableCaption>Eine Übersicht aller Tags</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead class="text-right w-[100px]"> Apps </TableHead>
            <TableHead>Tag</TableHead>
            <TableHead class="text-right w-[100px]"> Gewichtung </TableHead>
            <TableHead class="text-right"> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="tag in tableData"
            :key="tag.id"
          >
            <TableCell class="text-right">
              <Badge variant="outline">
                {{ tag.services?.length }}
              </Badge>
            </TableCell>
            <TableCell class="font-medium">
              <Tag
                :name="tag.name"
                :color="tag.color"
              />
            </TableCell>
            <TableCell class="text-right">
              {{ tag.weight }}
            </TableCell>
            <TableCell class="text-right">
              <Button variant="ghost">
                <PenIcon />
              </Button>
              <Button variant="ghost" @click="deleteTag(tag.id)">
                <TrashIcon />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colspan="3"> Total </TableCell>
            <TableCell class="text-right"> {{ sortedTags.length }} </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </PageContent>
  </Page>
</template>
