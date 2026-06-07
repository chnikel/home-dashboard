import { store } from "@/store";
import { computed, type Ref } from "vue";

const replaceSearchText = (text: string) => {
  let updatedText = text;

  const searchTextMapping = {
    "-": "",
    ö: "o",
    ü: "u",
    ä: "a",
  };

  Object.entries(searchTextMapping).forEach(([key, value]) => {
    updatedText = updatedText.replace(key, value);
  });

  return updatedText;
};

export function useFilteredServices(
  searchText: Ref<string, string>,
  includeEnabled: Ref<boolean>,
) {
  const filteredServiceGroups = computed(() =>
    store.groups.map((group) => {
      const filteredServices = group.services.filter((service) => {
        if (searchText.value.includes("#")) {
          return service.tags.some((tag) =>
            tag.name
              .toLowerCase()
              .includes(searchText.value.replace("#", "").toLowerCase()),
          );
        }

        return [
          service.title,
          service.description,
          replaceSearchText(service.title),
          replaceSearchText(service.description),
        ]
          .join("")
          .toLowerCase()
          .includes(searchText.value.toLowerCase());
      });

      const filteredEnabledServices = filteredServices.filter((service) => {
        if (includeEnabled.value) {
          return true;
        }

        return service.enabled;
      });

      return {
        group,
        services: filteredEnabledServices,
      };
    }),
  );

  const totalServiceCount = computed(() =>
  filteredServiceGroups.value
    .flatMap((item) => item.services.length)
    .reduce((acc, value) => acc + value, 0),
);

  return {
    services: filteredServiceGroups,
    totalCount: totalServiceCount,
  };
}
