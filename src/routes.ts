import type { RouteRecordRaw } from "vue-router";
import HomeView from "./pages/HomeVIew.vue";

export const routes: RouteRecordRaw[] = [
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
    path: "/tags",
    children: [
      {
        path: ":id/edit",
        name: "tags-edit",
        component: () => import("./pages/ServiceEditPage.vue"),
      },
       {
        path: "",
        name: "tags",
        component: () => import("./pages/TagsView.vue"),
      },
    ],
  },
  {
    path: "/",
    component: HomeView,
  },
];
