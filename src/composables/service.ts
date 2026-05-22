import ServiceRepository from "@/repositories/ServiceRepository";
import { useAsyncState } from "@vueuse/core";

export function useService(id: string) {
  const { state, isReady, isLoading, error } = useAsyncState(
    ServiceRepository.getById(id),
    null,
  );

  return { service: state, isReady, isLoading, error };
}
