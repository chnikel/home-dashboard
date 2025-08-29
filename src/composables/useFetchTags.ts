import { ref, watchEffect } from "vue";
import { useFetch } from "./useFetch";
import type { TagColors } from "@/components/Tag.vue";
import type { GetTagsResponse } from "@/api";

export function useTags() {
  const host = import.meta.env.VITE_FRONTEND_HOST || "";

  const tags = ref<{ id: string; name: string; color: TagColors }[]>([]);

  const { data, error } = useFetch<GetTagsResponse[]>(`${host}/tags`);

  watchEffect(() => {
    if (!data.value) {
      return;
    }
    tags.value = data.value.map((tag) => {
      return {
        id: tag.id.toString(),
        name: tag.name,
        color: tag.color as TagColors,
      };
    });
  });

  return {
    tags,
  };
}
