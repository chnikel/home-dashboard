import { computed, reactive } from "vue";
import { getTags, type GetGroupsResponse, type GetTagsResponse } from "./api";

export const store = reactive({
  groups: [] as GetGroupsResponse[],
  tags: [] as GetTagsResponse[],
});

export async function updateLocalTags() {
  const tags = await getTags();
  store.tags = tags;
}

export function findTag(id: number) {
  return store.tags.find((t) => {
    return t.id === id;
  });
}

export function tagsSortedByWeight() {
  return computed(() =>
    store.tags.sort((a, b) => {
      return b.weight - a.weight;
    })
  );
}
