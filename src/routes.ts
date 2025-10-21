import { createRouter, createWebHashHistory } from "vue-router";

import HomeView from "./pages/HomeView.vue";
import SettingsView from "./pages/SettingsView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/settings", component: SettingsView },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
