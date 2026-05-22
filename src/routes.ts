import AppsView from "./pages/AppsView.vue";
import HomeView from "./pages/HomeView.vue";
import ServiceEditPage from "./pages/ServiceEditPage.vue";

export const routes = [
  {
    path: "/apps",
    name: "apps",
    component: AppsView,
  },
  {
    path: "/services/:id/edit",
    name: "service-edit",
    component: ServiceEditPage,
  },
  {
    path: "/",
    component: HomeView,
  },
];
