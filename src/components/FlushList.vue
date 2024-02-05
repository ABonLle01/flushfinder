<template>
  <ion-list>
    <ion-card v-for="(flush, index) in flushList" :key="index" class="card" v-bind:data-id="index" @click="setLocation({
      latitude: Number(flush.latitude),
      longitude: Number(flush.longitude)
    })">
      <ion-row>

        <ion-col size="4" class="col">
          <div class="bath">
            <img alt="BathLogo" v-bind:src="flush.image" />
          </div>
        </ion-col>

        <ion-col size="8" class="col">

          <div class="properties">
            <ion-row class="data">
              <p>
                {{ flush.score }} | {{ condition(flush.score) }} |
                {{ calcularDistancia(Number(flush.latitude), Number(flush.longitude)) }} km
              </p>
            </ion-row>

            <ion-row>
              <ion-title class="name">{{ flush.name }}</ion-title>
            </ion-row>

            <ion-row class="filters">
                <ion-row>
                  
                  <ion-col>
                    <ion-thumbnail v-if="flush.handicapped" class="icon">
                      <img alt="handicapped" src="../images/filters/handicapped.png" />
                    </ion-thumbnail>
                  </ion-col>

                  <ion-col>
                    <ion-thumbnail v-if="flush.changingstation" class="icon">
                      <img alt="changingstation" src="../images/filters/babychanger.png" />
                    </ion-thumbnail>
                  </ion-col>

                  <ion-col size="3">
                    <ion-thumbnail v-if="flush.free" class="icon">
                      <img alt="Free" src="../images/filters/free.png" />
                    </ion-thumbnail>
                  </ion-col>

              </ion-row>
            </ion-row>

          </div>
        </ion-col>
      </ion-row>
    </ion-card>
  </ion-list>
</template>
  
<script setup lang="ts">

import { IonList, IonCard, IonRow, IonCol, IonThumbnail, IonTitle } from '@ionic/vue';
import { ref } from 'vue';
import { haversineDistance } from '@/store/index';
import { Geolocation } from '@ionic-native/geolocation';
import { Coordinates } from '@/interfaces';

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

const currentLocation = ref({ 
  latitude: props.initialLocation.latitude ? props.initialLocation.latitude : 0, 
  longitude: props.initialLocation.longitude ? props.initialLocation.longitude : 0
});


let lat:number = 0;
let long:number = 0;

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


const calcularDistancia = (latitude: number, longitude: number) => {
  const puntoA: Coordinates = {
    latitude: currentLocation.value.latitude,
    longitude: currentLocation.value.longitude
  };

  const puntoB: Coordinates = {
    latitude,
    longitude
  };

  const distancia = haversineDistance(puntoA, puntoB);
  return distancia.toFixed(2);
};


const emit = defineEmits(['setLocation'])

const setLocation = (args) => {
  emit('setLocation', args)
}

const condition = (x: number): string => {
  let result: string;

  switch (true) {
    case x < 0:
      console.log("Negative number!!");
      break;
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
  justify-content: flex-start;
  align-items: center;
  margin-top: 0;
  border-radius: 15px;
}

.bath {
  margin: auto;
  margin-left: 10px;
}

.bath img {
  height: 120px;
  width: 120px;
  border-radius: 15px;
}
.bath img{
  max-height: 100px;
  max-width: 100px;
  min-width: 100px;
  min-height: 100px;
  border-radius: 15px;
}

.col {
  display: flex;
  flex-direction: row;
  align-items: center;
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
  margin: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

</style>
  