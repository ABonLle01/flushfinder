<template>
  <ion-list>
    <ion-card v-for="(flush, index) in flushList" :key="index" class="card" :style="{ 'background-color': store.state.selectedCardName === flush.name ? '#ea358c2a' : '' }"
              v-bind:data-id="index" @click="setLocaltionAndHighlight(index, flush.name)">

      <ion-col size="4" class="col">
        <div class="bath">
<!--      <img alt="BathLogo" v-bind:src="flush.image" /> -->
          <img alt="" :src="getCompleteImageUrl(flush.image)"/>
        </div>
      </ion-col>
    
      <ion-col size="8" class="col info">

        <div class="properties">
          <ion-row class="data line">
            <ion-col class="infoCol">
              <div class="score">
                <p>{{ flush.score }}</p>
                <img src="../images/star.png" alt="yellow star">
              </div>
              
            </ion-col>
            <ion-col class="infoCol">
              <p>{{ condition(flush.score) }}</p>
            </ion-col>
            <ion-col class="infoCol">
              <p>{{ calcularDistancia(Number(flush.latitude), Number(flush.longitude)) }}</p>
            </ion-col>
          </ion-row>

          <ion-row class="line">
            <ion-title class="name">{{ flush.name }}</ion-title>
          </ion-row>

          <ion-row class="filters line">      
            <ion-col class="filter infoCol">
              <ion-thumbnail v-if="flush.handicapped" class="icon">
                <img alt="handicapped" src="../images/filters/handicapped.png" />
              </ion-thumbnail>
            </ion-col>

            <ion-col class="filter infoCol">
              <ion-thumbnail v-if="flush.changingstation" class="icon">
                <img alt="changingstation" src="../images/filters/babychanger.png" />
              </ion-thumbnail>
            </ion-col>

            <ion-col class="filter infoCol">
              <ion-thumbnail v-if="flush.free" class="icon">
                <img alt="Free" src="../images/filters/free.png" />
              </ion-thumbnail>
            </ion-col>
          </ion-row>

        </div>
      </ion-col>
    </ion-card>
  </ion-list>
</template>
 
<script setup lang="ts">

import { IonList, IonCard, IonRow, IonCol, IonThumbnail, IonTitle } from '@ionic/vue';
import { ref } from 'vue';
import { haversineDistance } from '@/store/index';
import { Geolocation } from '@ionic-native/geolocation';
import { Coordinates } from '@/interfaces';
import { useStore } from 'vuex';
import { VUE_APP_API_URL } from '@/services/index';

// Uso de la función useStore para obtener el estado global de la aplicación
const store = useStore();

// Definición de las propiedades esperadas utilizando defineProps para declarar las propiedades esperadas en un componente Vue.
const props = defineProps({
  flushList: {
    type: Array<any>
  },
  initialLocation: {
    type: Object
  },
  filtros: {
    type: Object
  }
})

// Función para obtener la URL completa de una imagen
const getCompleteImageUrl = (imageName: string) => {
return `${VUE_APP_API_URL}uploads/${imageName}`;
/*   return `https://api.flushfinder.es/uploads/${imageName}`; */
};

// Referencia para la ubicación actual
const currentLocation = ref({ 
  latitude: props.initialLocation.latitude ? props.initialLocation.latitude : 0, 
  longitude: props.initialLocation.longitude ? props.initialLocation.longitude : 0
});

let lat:number = 0;
let long:number = 0;

// Obtención de la posición actual del dispositivo
Geolocation.getCurrentPosition().then((resp) => {
  currentLocation.value = {
    latitude: resp.coords.latitude,
    longitude: resp.coords.longitude
  };

  lat = resp.coords.latitude;
  long = resp.coords.longitude;

  console.log("Latitud: " + lat + ", Longitud: " + long);

}).catch((error) => {
  console.error('Error getting location', error);
});

// Función para calcular la distancia entre dos puntos
const calcularDistancia = (latitude: number, longitude: number) => {
  const puntoA: Coordinates = {
    latitude: currentLocation.value.latitude,
    longitude: currentLocation.value.longitude
  };

  const puntoB: Coordinates = {
    latitude,
    longitude
  };

  let distancia = haversineDistance(puntoA, puntoB);
  let result = "";
  
  // Formateo del resultado en metros o kilómetros dependiendo de la distancia
  if(distancia<1){
    distancia=distancia * 1000;
    distancia=parseFloat(distancia.toFixed(0));
    result = distancia + " m";
  }else{
    distancia=parseFloat(distancia.toFixed(2));
    result = distancia + " km"
  } 
  
  return result;
};

// Emisión de eventos definidos utilizando defineEmits para declarar los eventos personalizados que un componente Vue puede emitir.
const emit = defineEmits(['setLocation'])
 
const setLocation = (args) => {
  emit('setLocation', args)
}

// Función para establecer la ubicación y resaltarla
const setLocaltionAndHighlight = (index:number, name:string) => {
  setLocation({
    latitude: Number(props.flushList[index].latitude),
    longitude: Number(props.flushList[index].longitude)
  });
  store.state.selectedCardName = name;

}

// Función para definir el estado de limpieza basado en un valor numérico
const condition = (x: number): string => {
  let result: string;

  switch (true) {
    case x >= 4:
      result = "Excelente";
      break;
    case x >= 3:
      result = "Bueno";
      break;
    case x >= 2:
      result = "Aceptable";
      break;
    case x >= 1:
      result = "Sucio";
      break;
    case x<1:
      result = "Muy sucio";
      break;
    default:
      result = "undefined";
  }

  return result;
};

</script>
 



<style scoped>

.card {
  display: flex;
  justify-content:center;
  align-items: center;
  margin-top: 0;
  border-radius: 15px;
  
  height: 9rem;
}
 
.bath {
  margin: auto;
  margin-left: 10px;
}
 
.bath img {
  height: 120px;
  width: 120px;
  border-radius: 15px;
  background-image:url("../icon1024square.png"); 
  background-size:cover;
}
.bath img{
  max-height: 100px;
  max-width: 100px;
  min-width: 100px;
  min-height: 100px;
  border-radius: 15px;
}

.info{
  width: 100%;
}

.col {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
 
.filters {
  display: flex;
  justify-content: center;
  gap: 15px;
}
 
.filters img {
  height: 35px;
  width: 35px;
}
 
.name {
  margin: 0;
  font-size: 1.2rem;
  width: 100%;
}
 
.data {
  display: flex;
  flex-direction: row;
  gap: 15px;
}

.properties{
  width: 100%;
}

.filter{
  height: 3rem;
}

.infoCol{
  display: flex;
  justify-content: center;
}

.score{
  display: flex;
  align-items: center;
}

.score img{
  width: 15px;
  height: 15px;
  margin-left: 2px;
  padding-bottom: 1px;
}



@media screen and (min-width: 1100px) {

  .infoCol p{
    font-size: large;
  }
  
}
</style>
 