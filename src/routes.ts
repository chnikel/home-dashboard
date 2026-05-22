import HomeView from "./pages/HomeView.vue";
import ServiceEditPage from "./pages/ServiceEditPage.vue";

export const routes = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/services/:id/edit",
    name: "service-edit",
    component: ServiceEditPage,
  },
];
