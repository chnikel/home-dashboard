import { createApp } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
import App from "./App.vue";
import { routes } from "./routes";
import "./style.css";

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
