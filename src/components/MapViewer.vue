<template>
  <ion-page>
    <ion-content>
      <div :id="mapId"></div>
      <Toaster/>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, watchEffect } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { IonPage, IonContent } from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';
import currentMarkerIcon from '../images/marklocation.png';
import markerIcon from '../images/mapMarker.png';
import blueMarker from '../images/blueMarker.png';
import { useStore } from 'vuex';
import { locationService } from "../services/DataService";
import Toaster from "./Toaster.vue";
import useToasterStore from "../store/useToasterStore";
import { VUE_APP_API_URL } from '@/services/index';

const store = useStore();
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

const toasterStore = useToasterStore();

const successToast = (successMessage: string) => {
  toasterStore.success({ text: successMessage });
};


let c1 = locationService.mapLocation.latitude;
let c2 = locationService.mapLocation.longitude;
let url = `${VUE_APP_API_URL}flush?latitude=${c1}&longitude=${c2}`;

const initializeMap = async () => {

  try {

    const response = await fetch(url);
    const flushList = await response.json();

    const initialCoordinates: L.LatLngTuple = [props.latitude, props.longitude];
    map.value = L.map(props.mapId).setView(initialCoordinates, 13,{animate: false});
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo( map.value as L.Map);

    const mapMarker = L.icon({
      iconUrl: markerIcon,
      iconSize: [32, 51],
      iconAnchor: [16, 51],
      popupAnchor: [0, -32],
    });

    flushList.forEach((flush) => {
      const markerCoordinates: L.LatLngTuple = [flush.latitude, flush.longitude];
      if (map.value) {
        const marker = L.marker(markerCoordinates, { icon: mapMarker }).addTo(map.value as L.Map);
          
        let divPopup = document.createElement("div");
        divPopup.innerHTML =             
        `
          <h3>${flush.name}</h3>
          <p>Puntuacion: ${flush.score}</p>
          <p>Estado: ${condition(flush.score)}</p>
          <p>Valoraciones: ${flush.rating}</p>
          <button class="inc">Incrementar Puntuación</button>
          <button class="dec">Disminuir Puntuación</button>
          `;

        divPopup.querySelector("button.inc").addEventListener("click",()=>{
          console.log("Like");
          console.log(flush);
          updateScore(flush._id, true)
          successToast("Voto hecho correctamente")
        });

        divPopup.querySelector("button.dec").addEventListener("click",()=>{
          console.log("Dislike");
          console.log(flush);
          updateScore(flush._id, false)
          successToast("Voto hecho correctamente")
        });

        marker.bindPopup(divPopup);

        marker.on('click',()=>{
          store.state.selectedCardName = flush.name;
        });

        console.log(flush);
      }
    })

    map.value.on('moveend', () => {
      map.value.closePopup();
    });

    console.log('Map initialized with custom markers');
  } catch (error) {
    console.error('Error fetching flush list:', error);
  }
};

const condition = (x: number): string => {
  let result: string;

  switch (true) {
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

function updateScore(flushId, shouldIncrement) {



  fetch(`${VUE_APP_API_URL}flush/${flushId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ increment: shouldIncrement }),
  })
    .then(response => {
      if (response.status === 410) {
        return { message: 'Objeto eliminado' };
      } else if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.message) {
        console.log(data.message);
      } else {
        console.log('Actualización exitosa', data);
      }
    })
    .catch(error => {
      console.error('Error al actualizar la puntuación', error);
    });
}



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

  locationService.state.latitude=latitude;
  locationService.state.longitude=longitude;

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    const event = new CustomEvent('map-click', {
      detail: { lat: latitude, lng: longitude }    
    });
    registerForm.dispatchEvent(event);
  }
}; 


const isMarkerAdded = ref(false); // Nuevo estado para rastrear si se ha agregado un marcador

let currentMarker: L.Marker | null = null;

const addMarker = (coordinates: L.LatLng) => {
  if (map.value) {
    // Elimina el marcador actual si existe
    if (currentMarker) {
      map.value.removeLayer(currentMarker); // Elimina el marcador actual del mapa
      currentMarker = null; // Actualiza la referencia al marcador actual
    }
 
    const onclickMarker = L.icon({
      iconUrl: blueMarker,
      iconSize: [29, 45],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
 
    const marker = L.marker(coordinates, { icon: onclickMarker }).addTo(map.value as L.Map);
 
    // Actualiza la referencia al marcador actual
    currentMarker = marker;
 
    // Agrega el marcador al formulario o realiza otras acciones necesarias
    registerFormHandler(coordinates.lat, coordinates.lng);
  }
};



watchEffect(() => {
  map.value?.on('click', (event: L.LeafletMouseEvent) => {
    if(!store.state.showList) addMarker(event.latlng);
    else{
      map.value.removeLayer(currentMarker);
    } 
  });
});


</script>



<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
