import {
  CloudOffIcon,
  ConstructionIcon,
  HardDriveIcon,
  RadioIcon,
  UnplugIcon,
} from "lucide-vue-next";

export const preConfiguredIcons = {
  disconnected: {
    component: UnplugIcon,
    colorClass: "bg-red-600",
  },
  offline: {
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
    colorClass: "bg-neutral-900",
  },
};
