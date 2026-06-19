import ServiceRepository from "@/repositories/ServiceRepository";
import { useAsyncState } from "@vueuse/core";

export function useService(id: string) {
  const { state, isReady, isLoading, error } = useAsyncState(
    ServiceRepository.getById(id),
    null,
  );

  return { service: state, isReady, isLoading, error };
}

export function useServices() {
  const { state, isReady, isLoading, error } = useAsyncState(
    ServiceRepository.get(),
    null,
  );

  const serviceById = (id: number | string) => {
    return state.value?.find((service) => service.id == id);
  };

  return {
    services: state,
    isReady,
    isLoading,
    error,
    serviceById,
  };
}
