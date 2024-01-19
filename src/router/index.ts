import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Registro from '../components/Registro.vue';
import MainPage from '../components/MainPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/MainPage',
    component: MainPage,
    children: [
      {
        path: 'registro',
        component: Registro,
        meta: { showRegistro: true }
      }
    ]
  },
  {
    path: '/',
    redirect: '/MainPage'
  },
  {
    path: '/registro',
    component: Registro,
    meta: { showRegistro: false }
  },
  {
    path: '/App',
    component: () => import ('../App.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
