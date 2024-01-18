<template>
  <ion-page>
    <ion-content>
      <div id="map"></div>
    </ion-content>
  </ion-page>
</template>
  
<script setup lang="ts">
/* export default {
  name: 'MapViewer'
} */
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

    return {
      map,
    };
  },
};
</script> -->

<style scoped>
#map {
  width: 100%;
  height: 100vh;
}
</style>

