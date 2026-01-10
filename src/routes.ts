import DeletedServices from "./pages/DeletedServices.vue";
import HomeView from "./pages/HomeView.vue";

export const routes = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/settings",
    component: () => import("./pages/SettingsView.vue"),
    children: [
      {
        path: "deleted-services",
        component: DeletedServices,
        meta: {
          title: "Gelöschte Services"
        }
      },
    ],
  },
];
