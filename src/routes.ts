import AppsView from "./pages/AppsView.vue";
import ServiceEditPage from "./pages/ServiceEditPage.vue";

export const routes = [
  {
    path: "/apps",
    component: AppsView,
  },
  {
    path: "/services/:id/edit",
    name: "service-edit",
    component: ServiceEditPage,
  },
  {
    path: "/",
    redirect: "/apps",
  },
];
