import { computed, reactive } from "vue";
import { type GetServicesResponse, type GetTagsResponse } from "./api";
import PingService from "./services/PingService";
import TagRepository from "./repositories/TagRepository";
import { useLocalStorage } from "@vueuse/core";

const pingService = new PingService();

export type ServicePing = {
  serviceId: number;
  isReachable: boolean;
};

export const store = reactive({
  groups: [] as {
    id: string;
    title: string;
    services: GetServicesResponse[];
  }[],
  tags: [] as GetTagsResponse[],
  servicePings: [] as ServicePing[],
  pinnedServiceIds: useLocalStorage<string[]>("pinned_service_ids", []),
});

export async function updateLocalTags() {
  const tags = await TagRepository.get();
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
    }),
  );
}

export async function updateLocalServicePings() {
  const response = await pingService.pingAllEnabledServices();

  store.servicePings = response;
}
