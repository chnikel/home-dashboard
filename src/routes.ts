import HomeView from "./pages/HomeView.vue";

export const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("./pages/SettingsView.vue"),
  },
];
