<template>
  <ion-page>
    <ion-content>
      <div id="map"></div>
    </ion-content>
  </ion-page>
</template>
 
<script lang="ts">
import { ref, onMounted } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getFlushList } from '@/services';
 
/* defineProps({
  flushList: {
    type: Array<any>
  }
}); */
 
// Importa la imagen personalizada
import markerIcon from '../images/mapMarker.png';
 
export default {
  name: 'MapViewer',
  setup() {
    const map = ref(null);
 
    const initializeMap = async () => {
      try {
        const response = await fetch('https://api.flushfinder.es/flushes');
        const flushList = await response.json();
 
        const initialCoordinates: L.LatLngTuple = [36.690126, -4.397479];
        map.value = L.map('map').setView(initialCoordinates, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);
 
        const customIcon = L.icon({
            iconUrl: markerIcon,
            iconSize: [32, 51],
            iconAnchor: [16, 51],
            popupAnchor: [0, -32],
        });
 
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
 
    return {
      map,
    };
  },
};
</script>
 
 
<style scoped>
#map {
  width: 100%;
  height: 100vh;
}
</style>