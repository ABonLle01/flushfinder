import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Registro from '../components/Registro.vue';
import MainPage from '../components/MainPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: MainPage,
    children: [
      {
        path: 'registro',
        component: Registro,
        meta: { showRegistro: true },
      }
    ]
  },
  {
    path: '/',
    redirect: '/'
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
