<template>
  <ion-page>
    <ion-content>
      <div :id="mapId"></div>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, watchEffect } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { IonPage, IonContent } from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';

const map = ref<L.Map | null>(null);
const userMarker = ref<L.Marker | null>(null);
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

import currentMarkerIcon from '../images/marklocation.png';
import markerIcon from '../images/mapMarker.png';

const initializeMap = async () => {
  try {
    const response = await fetch('https://api.flushfinder.es/flush');
    const flushList = await response.json();

    const initialCoordinates: L.LatLngTuple = [props.latitude, props.longitude];
    map.value = L.map(props.mapId).setView(initialCoordinates, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo( map.value as L.Map);

    const customIcon = L.icon({
      iconUrl: currentMarkerIcon,
      iconSize: [32, 51],
      iconAnchor: [16, 51],
      popupAnchor: [0, -32],
    });
    const mapMarker = L.icon({
      iconUrl: markerIcon,
      iconSize: [32, 51],
      iconAnchor: [16, 51],
      popupAnchor: [0, -32],
    });

    flushList.forEach((flush) => {
      const markerCoordinates: L.LatLngTuple = [flush.latitude, flush.longitude];
      if (map.value) {
        L.marker(markerCoordinates, { icon: mapMarker }).addTo(map.value as L.Map);
      }
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

  const onLocationUpdate = (position: GeolocationPosition) => {
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
        map.value?.setView([latitude, longitude], map.value?.getZoom() || 17);
        isInitialPosSet.value = true;
      }
    }
  };

  const onError = (error: GeolocationPositionError) => {
    console.error('Error getting location:', error);
  };
  
  // Inicia el seguimiento de la ubicación del usuario
  navigator.geolocation.watchPosition(onLocationUpdate, onError, watchOptions);
};

onMounted(() => {
  initializeMap();

  const initialCoordinates: L.LatLngTuple = [props.latitude, props.longitude];
  const userMarkerIcon = L.icon({
    iconUrl: currentMarkerIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  if (map.value) {
    userMarker.value = L.marker(initialCoordinates, { icon: userMarkerIcon }).addTo(map.value as L.Map);
  } else {
    const unwatch = watch(() => map.value, (newValue) => {
      if (newValue) {
        userMarker.value = L.marker(initialCoordinates, { icon: userMarkerIcon }).addTo(newValue as L.Map);
        unwatch();
      }
    });
  }

  watchUserLocation();
});

watch(props, () => {
  const initialCoordinates: L.LatLngTuple = [props.latitude, props.longitude];
  map.value?.setView(initialCoordinates, 17);
});

// Función para llamar a la función del formulario de registro con las coordenadas del marcador
const registerFormHandler = (latitude: number, longitude: number) => {
  console.log('Manejador de formulario de registro llamado con:', latitude, longitude); // Agregar un registro para verificar las coordenadas
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    const event = new CustomEvent('map-click', {
      detail: { lat: latitude, lng: longitude }
    });
    registerForm.dispatchEvent(event);
  }
};


const isMarkerAdded = ref(false); // Nuevo estado para rastrear si se ha agregado un marcador

// Define la función para agregar un marcador al mapa
const addMarker = (coordinates: L.LatLng) => {
  if (map.value && !isMarkerAdded.value) { // Verifica si no se ha agregado ya un marcador
    // Crea un nuevo marcador en las coordenadas dadas
    const marker = L.marker(coordinates).addTo(map.value as L.Map);
    console.log('Marcador agregado en coordenadas:', coordinates); // Agregar un registro para verificar las coordenadas del marcador
    
    // Agrega el marcador al formulario o realiza otras acciones necesarias
    registerFormHandler(coordinates.lat, coordinates.lng);

    isMarkerAdded.value = true; // Marca que se ha agregado un marcador
  }
};

watchEffect(() => {
  map.value?.on('click', (event: L.LeafletMouseEvent) => {
    const clickedCoordinates = event.latlng;
    console.log('Coordenadas del clic:' + clickedCoordinates); // Agregar un registro para verificar las coordenadas
    addMarker(clickedCoordinates);
  });
});

</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
