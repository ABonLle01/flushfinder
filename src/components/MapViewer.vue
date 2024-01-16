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


export default {
  name: 'MapViewer',
  setup() {
    const map = ref(null);

    onMounted(() => {
  map.value = L.map('map').setView([36.719585112950064, -4.365667652038817], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);
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
