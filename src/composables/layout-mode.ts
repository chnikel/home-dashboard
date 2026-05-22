import type { RemovableRef } from "@vueuse/core";
import { inject } from "vue";

export type ModeRepository = {
  compactMode: RemovableRef<boolean>;
};

export function useLayoutMode() {
  const modeRepository = inject<ModeRepository>("mode-repository");

  if (!modeRepository) {
    throw new Error("No mode repository provided");
  }

  return {
    isCompact: modeRepository.compactMode,
  };
}
