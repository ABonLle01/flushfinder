<template>
    <ion-page>
      <ion-content>
        <div id="map"></div>
      </ion-content>
    </ion-page>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import 'leaflet/dist/leaflet.css';
  import L from 'leaflet';
  
  export default {
    name: 'Mapa',
    setup() {
      const map = ref(null);
  
      onMounted(() => {
        map.value = L.map('map').setView([51.505, -0.09], 13);
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
    height: 100vh;
    width: 100%;
  }
  </style>
  