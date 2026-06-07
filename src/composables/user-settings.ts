import { useLocalStorage } from "@vueuse/core";
import { ref } from "vue";

export function useUserSettings() {
  const isEditMode = ref(false);
  const showHiddenServices = useLocalStorage(
    "setting.services.showHidden",
    false,
  );

  return {
    isEditMode,
    showHiddenServices,
  };
}
