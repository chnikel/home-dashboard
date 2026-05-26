import HomeView from "./pages/HomeVIew.vue";

export const routes = [
  {
    path: "/apps",
    name: "apps",
    component: () => import("./pages/AppsView.vue"),
  },
  {
    path: "/services/new",
    name: "service-add",
    component: () => import("./pages/ServiceAddPage.vue"),
  },
  {
    path: "/services/:id/edit",
    name: "service-edit",
    component: () => import("./pages/ServiceEditPage.vue"),
  },
  {
    path: "/",
    component: HomeView,
  },
];
