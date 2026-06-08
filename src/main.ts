import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import { routes } from "./routes";
import "./style.css";
import { useRouteProgress } from "./composables/route-progress.ts";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const { start, finish } = useRouteProgress();

router.beforeEach((to, _, next) => {
  if (to.name) {
    start();
  }
  next();
});
router.beforeResolve((to, _, next) => {
  if (to.name) {
    finish();
  }
  next();
});

createApp(App).use(router).mount("#app");
