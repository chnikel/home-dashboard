import AppsView from "./pages/AppsView.vue";
import HomeView from "./pages/HomeVIew.vue";
import ServiceAddPage from "./pages/ServiceAddPage.vue";
import ServiceEditPage from "./pages/ServiceEditPage.vue";

export const routes = [
  {
    path: "/apps",
    name: "apps",
    component: AppsView,
  },
  {
    path: "/services/new",
    name: "service-add",
    component: ServiceAddPage,
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
