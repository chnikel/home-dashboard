import TagRepository from "@/repositories/TagRepository";
import { useAsyncState } from "@vueuse/core";

export function useTags() {
  const { state, isReady, isLoading, error } = useAsyncState(
    TagRepository.get(),
    null,
  );

  return { tags: state, isReady, isLoading, error };
}
