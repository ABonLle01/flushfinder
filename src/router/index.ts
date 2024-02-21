import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Registro from '../components/Registro.vue';
import MainPage from '../components/MainPage.vue';

// Definición de las rutas de la aplicación utilizando el enrutador Vue Router
const routes: Array<RouteRecordRaw> = [
  {
    path: '/', // Ruta raíz de la aplicación
    component: MainPage, // Componente principal que contendrá las páginas de la aplicación
    children: [
      {
        path: '/', // Ruta raíz dentro de la página principal
        component: Registro, // Componente que se mostrará en la ruta raíz
        meta: { showRegistro: true }, // Metadatos asociados con la ruta
      }
    ]
  },
  {
    path: '/', // Otra ruta raíz de la aplicación
    redirect: '/' // Redirige cualquier acceso a la ruta raíz al '/'
  },
];

// Creación del enrutador utilizando la configuración de las rutas definidas anteriormente
const router = createRouter({
  history: createWebHistory(), // Tipo de historial de navegación (en este caso, se utiliza el historial de navegación del navegador)
  routes // Lista de rutas definidas anteriormente
});

export default router;
