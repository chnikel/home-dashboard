import { store } from "@/store";
import { useServices } from "./service";
import PinServiceRepository from "@/repositories/PinServiceRepository";
import { computed } from "vue";

export function usePinnedServices() {
  const { services, isLoading } = useServices();

  const toggle = (serviceId: string) => {
    if (isPinned(serviceId)) {
      PinServiceRepository.unpin(serviceId);
    } else {
      PinServiceRepository.pin(serviceId);
    }
  };

  const isPinned = (serviceId: string) => {
    return store.pinnedServiceIds.includes(serviceId);
  };

  const filteredServices = computed(() =>
    (services.value || []).filter((service) =>
      store.pinnedServiceIds.includes(service.id.toString()) && service.enabled,
    ),
  );

  return {
    services: filteredServices,
    toggle,
    isPinned,
    pin: PinServiceRepository.pin,
    unpin: PinServiceRepository.unpin,
    isLoading
  };
}
