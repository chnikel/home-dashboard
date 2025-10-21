import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from './pages/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})