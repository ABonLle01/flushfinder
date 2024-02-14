<template>
  <ion-page>
    <ion-content>
      <div :id="mapId"></div>
    </ion-content>
  </ion-page>
</template>
   
<script setup lang="ts">
import { ref, onMounted, watch, watchEffect, computed } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { IonPage, IonContent } from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';
import currentMarkerIcon from '../images/marklocation.png';
import markerIcon from '../images/mapMarker.png';
import { useStore } from 'vuex';

const store = useStore();
const selectedFlushName = computed(() => store.state.selectedFlushName);
const map = ref(null);
const userMarker = ref(null);

const isInitialPosSet = ref(false);

const props = withDefaults(defineProps<{
  latitude: number;
  longitude: number;
  mapId?: string;
}>(), {
  latitude: 0,
  longitude: 0,
  mapId: 'map',
});

const initializeMap = async () => {
  try {
    const response = await fetch('https://api.flushfinder.es/flush');
    const flushList = await response.json();

    const initialCoordinates: L.LatLngTuple = [props.latitude, props.longitude];
    map.value = L.map(props.mapId).setView(initialCoordinates, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);

    const customIcon = L.icon({
      iconUrl: currentMarkerIcon,
      iconSize: [32, 51],
      iconAnchor: [16, 51],
      popupAnchor: [0, -32],
    });
    const mapMarker = L.icon({
      iconUrl: markerIcon,
      iconSize: [32, 51],
      iconAnchor: [16, 46],
      popupAnchor: [0, -32],
    });

    watchEffect(() => {
      flushList.forEach((flush) => {
        const markerCoordinates: L.LatLngTuple = [flush.latitude, flush.longitude];
        if (map.value) {
          const marker = L.marker(markerCoordinates, { icon: mapMarker }).addTo(map.value);
            
          marker.bindPopup(
            `
            <h3>${flush.name}</h3>
            <p>Puntuacion: ${flush.score}</p>
            <p>Estado: ${flush.condition}</p>
            `
          );

          marker.on('click',()=>{
            store.commit('setSelectedFlushName', flush.name); 

            if (flush.name === selectedFlushName.value) {
              flush.isSelected = true;
            }
          });

          flush.isSelected = flush.name === selectedFlushName.value;

        }
      })
    });

    map.value.on('moveend', () => {
      map.value.closePopup();
    });

    console.log('Map initialized with custom markers');
  } catch (error) {
    console.error('Error fetching flush list:', error);
  }
};

const watchUserLocation = () => {
  const watchOptions = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000,
  };

  const onLocationUpdate = (position) => {
    const { latitude, longitude } = position.coords;

    // Verifica si userMarker.value está definido antes de actualizar su posición
    if (userMarker.value) {
      userMarker.value.setLatLng([latitude, longitude]);

      // Centra el mapa en la nueva ubicación del usuario
      if (!isInitialPosSet.value) {
        Preferences.set({
          key: 'userLastLocation', value: JSON.stringify({
            latitude,
            longitude
          })
        });
        map.value.setView([latitude, longitude], map.value.getZoom());
        isInitialPosSet.value = true
      }
    }
  };

  const onError = (error) => {
    console.error('Error getting location:', error);
  };
  // Inicia el seguimiento de la ubicación del usuario
  navigator.geolocation.watchPosition(onLocationUpdate, onError, watchOptions);
};

onMounted(() => {
  initializeMap();

  // Agrega el marcador del usuario después de inicializar el mapa
  const initialCoordinates: L.LatLngTuple = [props.latitude, props.longitude];
  const userMarkerIcon = L.icon({
    iconUrl: currentMarkerIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -32],
  });

  // Asegúrate de que map.value esté definido antes de agregar el marcador del usuario
  if (map.value) {
    userMarker.value = L.marker(initialCoordinates, { icon: userMarkerIcon }).addTo(map.value);
  } else {
    // Si map.value no está definido, intenta agregar el marcador después de que se inicialice el mapa
    const unwatch = watch(() => map.value, (newValue) => {
      if (newValue) {
        userMarker.value = L.marker(initialCoordinates, { icon: userMarkerIcon }).addTo(newValue);
        unwatch();
      }
    });
  }

  // Inicia el seguimiento de la ubicación del usuario
  watchUserLocation();
});

watch(props, () => {
  const initialCoordinates: L.LatLngTuple = [props.latitude, props.longitude];
  map.value.setView(initialCoordinates, 17);
});
</script>


   
<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>