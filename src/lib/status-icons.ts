import {
  CloudOffIcon,
  ConstructionIcon,
  HardDriveIcon,
  RadioIcon,
} from "lucide-vue-next";

export const preConfiguredIcons = {
  disconnected: {
    component: CloudOffIcon,
    colorClass: "bg-red-600",
  },
  live: {
    component: RadioIcon,
    colorClass: "bg-red-800",
  },
  deprecated: {
    component: ConstructionIcon,
    colorClass: "bg-blue-800/50",
  },
  device: {
    component: HardDriveIcon,
    colorClass: "bg-neutral-800",
  },
};
