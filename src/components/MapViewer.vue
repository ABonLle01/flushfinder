<template>
  <ion-page>
    <ion-content>
      <div :id="mapId"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import 'leaflet/dist/leaflet.css';
import L, { icon, marker } from 'leaflet';
import { getFlushList } from '@/services';

const props = withDefaults(defineProps<{
  latitude: number;
  longitude: number;
  mapId?: string
}>(), {
  latitude: 0,
  longitude: 0,
  mapId: 'map'
});

// Importa la imagen personalizada
import markerIcon from '../images/mapMarker.png';
import { IonPage, IonContent } from '@ionic/vue';

const map = ref(null);

const customIcon = L.icon({
      iconUrl: markerIcon,
      iconSize: [32, 51],
      iconAnchor: [16, 51],
      popupAnchor: [0, -32],
    });

const initializeMap = async () => {
  try {
    const response = await fetch('https://api.flushfinder.es/flushes');
    const flushList = await response.json();

    const initialCoordinates: L.LatLngTuple = [props.latitude, props.longitude];
    
    map.value = L.map(props.mapId).setView(initialCoordinates, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);

    

    flushList.forEach((flush) => {
      const markerCoordinates: L.LatLngTuple = [flush.latitude, flush.longitude];
      const marker = L.marker(markerCoordinates, { icon: customIcon }).addTo(map.value);
    });

    

    console.log('Map initialized with custom markers');
  } catch (error) {
    console.error('Error fetching flush list:', error);
  }
};

onMounted(() => {
  initializeMap();
});

watch(props, () => {
  const initialCoordinates: L.LatLngTuple = [props.latitude, props.longitude];
  map.value.setView(initialCoordinates, 16);

  /* L.marker(initialCoordinates, {icon: customIcon }).addTo(map.value); */

})
</script>


<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>