import GroupRepository from "@/repositories/GroupRepository";
import { useAsyncState } from "@vueuse/core";

export function useGroups() {
  const { state, isReady, isLoading, error } = useAsyncState(
    GroupRepository.get(),
    null,
  );

  return { groups: state, isReady, isLoading, error };
}
