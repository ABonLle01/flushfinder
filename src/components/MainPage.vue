<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <div class="container" >
        <!-- <ion-button @click="getCurrentLocation">Obtener Ubicación</ion-button> -->
        <div class="map">
          <MapViewer />
        </div>

        <div class="list">
          <FlushList :flushList="flushList" />
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>



<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import FlushList from '@/components/FlushList.vue';
import MapViewer from '@/components/MapViewer.vue';
import {Geolocation } from '@ionic-native/geolocation';
import { getFlushList } from '@/services'
import { onMounted, ref, watchEffect } from 'vue';

const flushList = ref([]);
const isHorizontal = ref(false);
const currentLocation = ref({ latitude: 0, longitude: 0 });

watchEffect(() => {
  console.log('isHorizontal:', !isHorizontal.value);
});


window.addEventListener('orientationchange', () => {
  isHorizontal.value = window.matchMedia('(orientation: landscape)').matches;
});
 
onMounted(async () => {
  flushList.value = await getFlushList();
 getCurrentLocation();  // Llama a la función al cargar la página */
})

const getCurrentLocation = () => {
  Geolocation.getCurrentPosition().then((resp) => {
    // Respuesta de tipo Position
    currentLocation.value = {
      latitude: resp.coords.latitude,
      longitude: resp.coords.longitude
    };
 
    // También puedes imprimir las coordenadas en la consola
    console.log('Latitude:', resp.coords.latitude);
    console.log('Longitude:', resp.coords.longitude);
  }).catch((error) => {
    console.error('Error getting location', error);
  });
};


</script>


<style scoped>

.map{
  height: 44vh;
  position: sticky;
  top: 0;
  z-index: 9;
}

/* .list{
  border: solid;
  border-color: blue; 
} */

.container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  /* border: solid 3px green; */
}

@media screen and (min-width: 700px){
  /*   *:hover{
    border: solid 10px red;
  } */

  .container{
    display: -webkit-box;
    flex-direction: row;
  }

  .map{
    width: 50%;
    height: 100vh;
  }

}

</style>
