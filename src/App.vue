<template>
  <ion-app>
    <!-- Menu de filtros -->
    <ion-menu content-id="main-content">
      <ion-header>
        <ion-toolbar color="undefined">
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <Filters  />
      </ion-content>
    </ion-menu>
    
    <!-- Opening -->
    <div v-if="showOpening"  class="opening-overlay" @click="closeOpening">
      <h1>Bienvenid@ a</h1>
      
      <div class="waviy">
        <span style="--i:1">F</span>
        <span style="--i:2">L</span>
        <span style="--i:3">U</span>
        <span style="--i:4">S</span>
        <span style="--i:5">H</span>
        <span style="--i:6">F</span>
        <span style="--i:7">I</span>
        <span style="--i:8">N</span>
        <span style="--i:9">D</span>
        <span style="--i:10">E</span>
        <span style="--i:11">R</span>
      </div>
      
      <p>Guía rápida de uso</p>
      <img src="./icon1024square.png" alt="logo">
      <label @click="closeOpening">Pulsa sobre la pantalla para continuar</label>


    </div>

    <!-- "Tutorial" -->
    <div v-if="showTutorial" class="tutorial-overlay" @click="closeTutorial">
      <div class="tutorial-content">
        <div class="tutorial-section top-left"> <img src="./images/tutorial/arrowleft.gif" alt="flecha izquierda"> Cambiar Filtros</div>
        <div class="tutorial-section top-right">Añadir Flush<img src="./images/tutorial/Flushfechaanimada.gif" alt="flecha derecha"> </div>
        
        <div class="lowSections">
          <div class="tutorial-section mapa">Mapa</div>
          <div class="tutorial-section lista">Lista de Baños</div>
          <button @click="closeTutorial">Pulsa sobre la pantalla para cerrar el tutorial</button>
        </div>

      </div>
    </div>

    <!-- "Menu" de navegacion -->
    <ion-page id="main-content">
      <ion-header>
        <ion-toolbar>
          <!-- boton de añadir -->
          <ion-fab horizontal="end" vertical="center">
            <ion-fab-button size="small" color="undefined" @click="toggleShowList()">
              <ion-icon :icon="add"></ion-icon>
            </ion-fab-button>
          </ion-fab>

          <!-- boton de filtros -->
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

    <!-- mapa + lista -->
    <ion-content class="ion-padding"> 
      <router-view ></router-view>
    </ion-content>
  </ion-page>
  </ion-app>
</template>



<script setup lang="ts">
import Filters from './components/Filters.vue';
import { add } from 'ionicons/icons';
import { IonApp, IonHeader, IonContent, IonIcon, IonMenu, IonFab, IonFabButton, IonToolbar, IonButtons, IonMenuButton, IonSearchbar, IonPage, IonTitle} from '@ionic/vue';
import { useStore } from 'vuex';
import { onMounted, ref } from 'vue';

const store = useStore();

const toggleShowList = () => {
  // Se activa una mutación correspondiente en el almacén Vuex que actualiza el estado de showList. 
  // El resultado es que la lista se muestra o se oculta según el estado actual de showList.
  store.dispatch('toggleShowList');
};

const showTutorial = ref(false);
const showOpening = ref(false);

// Función para cerrar el tutorial al hacer clic
const closeTutorial = () => {
  showTutorial.value = false;
  // Guardar preferencia localmente indicando que el tutorial se ha completado
  localStorage.setItem('tutorialCompleted', 'true');
};

// Función para cerrar el tutorial al hacer clic
const closeOpening = () => {
  showOpening.value = false;
  // Guardar preferencia localmente indicando que el tutorial se ha completado
  localStorage.setItem('openingCompleted', 'true');
};

onMounted(() => {
  if (localStorage.getItem('tutorialCompleted') !== 'true') {
    showTutorial.value = true;
  }
  // Verificar si el tutorial ya se ha completado previamente
  if (localStorage.getItem('openingCompleted') !== 'true') {
    showOpening.value = true;
  }
});




</script>

<style scoped>

/* Darle color a la parte principal cuando se despliega el menu */
ion-menu::part(backdrop) {
  background-color: rgb(0, 0, 0);
}

ion-menu::part(container) {
  border-radius: 0 20px 20px 0;
  box-shadow: 4px 0px 16px rgba(0, 0, 0, 0.637);
} 

/* Estilos para el overlay del tutorial */
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Estilos para el contenido del tutorial */
.tutorial-content {
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 90%; /* Ocupar el 90% del ancho de la pantalla */
  max-width: 600px; /* Establecer un ancho máximo para el contenido */
  color: rgb(255, 255, 255);
  text-shadow: rgb(255, 0, 200) 1px 1px 4px;
  font-size: large;
}

/* Estilos para las secciones del tutorial */
.tutorial-section {
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  margin-bottom: 10px;

  height: 45px;
}

.tutorial-section img{
  height: 15px;
  width: 30px;
}

.top-left {
  position: absolute;
  top: 6px;
  left: 10px;
  width: 200px;
  justify-content: end;
}

.top-right {
  position: absolute;
  top: 6px;
  right: 10px;
  width: 200px;
}


.tutorial-content button {
  padding: 15px;
  background-color: #007bff;
  font-size: large;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  bottom: 20px;
}

.mapa{
  position: absolute;
  top: 30%;
}

.lista{
  position: absolute;
  bottom: 30%;
}

.lowSections{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.opening-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #EA358C;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
}

.opening-overlay img{
  width: 300px;
  height: 300px;
}

@media screen and (min-width: 1100px) {

  .lowSections{
    justify-content: center;
    flex-direction: row;
    width: 100%;
  }

  .mapa{
    position: absolute;
    top:45%;
    left: 30%;
  }


  .lista{
    position: absolute;
    right: 10%;
    bottom: 50%;
  }

  .tutorial-content button {
    position: absolute;
    bottom: 50px;
  }

  .top-left {
    left: 10px;
    width: 215px;
  }

  .top-right {
    right: 10px;
    width: 215px;
  }

  .tutorial-section {
    padding: 20px;
  }

  .opening-overlay h1{
    font-size: 48px;
    font-weight: bold;
  }

  .opening-overlay p, label{
    font-size: 36px;
  }


  .opening-overlay img{
    width: 400px;
    height: 400px;
  }

}


@media screen and (max-width: 420px) {
 
  .top-left, .top-right {
    top: -3px;
    background-color: unset;
    font-size: smaller;
    padding: 30px;
  }

}


.waviy {
  position: relative;
}
.waviy span {
  position: relative;
  display: inline-block;
  font-size: 40px;
  color: #fff;
  text-transform: uppercase;
  animation: flip 3s infinite;
  animation-delay: calc(.2s * var(--i))
}
@keyframes flip {
  0%,80% {
    transform: rotateY(360deg) 
  }
}


</style>
