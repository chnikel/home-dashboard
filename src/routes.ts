import HomeView from "./pages/HomeView.vue";

export const routes = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/settings",
    component: () => import("./pages/SettingsView.vue"),
  },
];
