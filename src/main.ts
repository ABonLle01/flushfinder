import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { createPinia } from 'pinia'
const pinia = createPinia()

import { IonicVue } from '@ionic/vue';
import { Geolocation } from '@ionic-native/geolocation';

import ToastPlugin from 'vue-toast-notification';

import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';


/* Theme variables */
import './theme/variables.css';

addIcons({
  'toast-error': closeCircleOutline
});

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(pinia)
  .use(store)
  .use(ToastPlugin);

// Agrega el servicio de Geolocation al objeto global
 app.config.globalProperties.$geolocation = Geolocation; 

router.isReady().then(() => {
  app.mount('#app');
});
