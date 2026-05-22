import { useLocalStorage } from "@vueuse/core";

export function useLayoutMode() {
  const compactMode = useLocalStorage("compact_mode", true);

  return {
    isCompact: compactMode,
  };
}
