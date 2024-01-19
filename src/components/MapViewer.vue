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

        const initialCoordinates: L.LatLngTuple = [36.719585112950064, -4.365667652038817];
        map.value = L.map('map').setView(initialCoordinates, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);

        const customIcon = L.icon({
            iconUrl: markerIcon,
            iconSize: [32, 51],
            iconAnchor: [16, 32],
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
</style> */

/* <!-- <template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'MapViewer',
  props: {
    flushList: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const map = ref(null);

    const initializeMap = () => {
      setTimeout(() => {
        const initialCoordinates = [36.719585112950064, -4.365667652038817];

        map.value = L.map('map').setView(initialCoordinates, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);

        // Iterar sobre flushList y agregar marcadores
        props.flushList.forEach((flush) => {
          const customIcon = L.icon({
            iconUrl: markerIcon,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });

          const markerCoordinates = [flush.latitude, flush.longitude];
          const marker = L.marker(markerCoordinates, { icon: customIcon }).addTo(map.value);
        });

        console.log('Map initialized with custom markers');
      }, 100);
    };

    onMounted(() => {
      initializeMap();
    });


<style scoped>
#map {
  width: 100%;
  height: 100vh;
}
</style>
