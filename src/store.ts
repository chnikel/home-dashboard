import { computed, reactive } from "vue";
import { getTags, type GetServicesResponse, type GetTagsResponse } from "./api";
import PingService from "./services/PingService";

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

export async function updateLocalServicePings() {
  const response = await pingService.pingAllEnabledServices();

  store.servicePings = response;
}
