import { store } from "@/store";

export default {
  pin: (serviceId: string) => {
    store.pinnedServiceIds.push(serviceId);
  },
  unpin: (serviceId: string) => {
    store.pinnedServiceIds = store.pinnedServiceIds.filter(
      (item) => item !== serviceId,
    );
  },
};
