import { useLocalStorage } from "@vueuse/core";
import { computed, ref } from "vue";

export type SavedTab = { text: string }

export function useSavedSearch() {
  const searchText = ref("");

  const savedTabs = useLocalStorage<SavedTab[]>("saved_searches", []);

  const saveSearch = () => {
    const found =
      savedTabs.value.findIndex((item) => item.text === searchText.value) !==
      -1;

    if (found) {
      return;
    }

    savedTabs.value.push({
      text: searchText.value,
    });
  };

  const removeSavedSearchByText = (text: string) => {
    savedTabs.value = savedTabs.value.filter((value) => {
      return value.text !== text;
    });
  };

  const canSave = computed(
    () =>
      searchText.value != "" &&
      savedTabs.value.findIndex((item) => item.text === searchText.value) ===
        -1,
  );

  const toggle = (text: string) => {
  searchText.value = searchText.value === text ? "" : text;
};

  return {
    searchText,
    saveItem: saveSearch,
    removeItem: removeSavedSearchByText,
    canSave,
    savedTabs,
    toggle,
  };
}
