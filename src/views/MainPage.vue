<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $route.params.id }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <div class="container">
        <ion-button @click="getCurrentLocation">Obtener Ubicación</ion-button>
        
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
import MapViewer from '@/components/MapViewer.vue'; // Mantenido como MapViewer
import { getFlushList } from '@/services';
import { onMounted, ref } from 'vue';
import { Geolocation } from '@ionic-native/geolocation';

const flushList = ref([]);
const currentLocation = ref({ latitude: 0, longitude: 0 });

onMounted(async () => {
  flushList.value = await getFlushList(false);
  getCurrentLocation();
});

const getCurrentLocation = () => {
  Geolocation.getCurrentPosition().then((resp) => {
    currentLocation.value = {
      latitude: resp.coords.latitude,
      longitude: resp.coords.longitude,
    };

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
/*   border: solid;
  border-color: red; */
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
  border: solid;
  border-color: green;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
