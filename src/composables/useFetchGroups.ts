import { ref, watchEffect } from "vue";
import { useFetch } from "./useFetch";
import type { GetGroupsResponse } from "@/api";

export function useGroups() {
  const host = import.meta.env.VITE_FRONTEND_HOST || "";

  const groups = ref<{ id?: string; title: string }[]>([]);

  const { data, error } = useFetch<GetGroupsResponse[]>(`${host}/groups`);

  watchEffect(() => {
    if (!data.value) {
      return;
    }
    groups.value = data.value.map((tag) => {
      return {
        id: tag.id?.toString(),  
        title: tag.title,
      };
    });
  });

  return {
    groups,
  };
}
