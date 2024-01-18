import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Registro from '../components/Registro.vue';
import MainPage from '../components/MainPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/folder/Inbox'
  },
  {
    path: '/App',
    component: () => import ('../App.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router;
