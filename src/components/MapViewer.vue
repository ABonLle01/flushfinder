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
import {score, condition} from '../store/piniaStore';

const store = useStore(); // Uso de useStore para obtener el estado global de la aplicación
const map = ref<L.Map | null>(null); // Referencia reactiva para el mapa Leaflet
const userMarker = ref<L.Marker | null>(null); // Referencia reactiva para el marcador del usuario
const isInitialPosSet = ref(false); // Bandera para verificar si la posición inicial está establecida

// Propiedades predeterminadas con valores de latitud, longitud y mapId
const props = withDefaults(defineProps<{
  latitude: number;
  longitude: number;
  mapId?: string;
}>(), {
  latitude: 0,
  longitude: 0,
  mapId: 'map',
});

const toasterStore = useToasterStore(); // Uso de useToasterStore para mostrar notificaciones tipo toast

// Función para mostrar un toast de éxito
const successToast = (successMessage: string) => {
  toasterStore.success({ text: successMessage });
};

// Inicialización de variables para la ubicación del usuario y construcción de la URL para obtener la lista de baños
let c1 = locationService.mapLocation.latitude;
let c2 = locationService.mapLocation.longitude;
let url = `${VUE_APP_API_URL}flush?latitude=${c1}&longitude=${c2}`;

const initializeMap = async () => {

  try {
    // Obtiene los datos de los marcadores desde la API
    const response = await fetch(url); 
    const flushList = await response.json(); 

    // Establece las coordenadas iniciales del mapa
    const initialCoordinates: L.LatLngTuple = [props.latitude, props.longitude];
    // Crea y configura el mapa Leaflet, estableciendo la vista y desactivando la animación
    map.value = L.map(props.mapId).setView(initialCoordinates, 13,{animate: false});
    
    // Añade una capa OpenStreetMap al mapa para poner los marcadores
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo( map.value as L.Map);

    // Define el ícono personalizado para los marcadores del mapa
    const mapMarker = L.icon({
      iconUrl: markerIcon,
      iconSize: [32, 51],
      iconAnchor: [16, 51],
      popupAnchor: [0, -32],
    });

    // Itera sobre la lista de marcadores y añade cada uno al mapa con su información y eventos asociados
    flushList.forEach((flush) => {
      const markerCoordinates: L.LatLngTuple = [flush.latitude, flush.longitude];
      if (map.value) {
        const marker = L.marker(markerCoordinates, { icon: mapMarker }).addTo(map.value as L.Map);

        // Crea el contenido del popup para cada marcador con información detallada y botones de interacción
        let divPopup = document.createElement("div");
        divPopup.innerHTML =             
        `
          <div class="popup">
            <h3>${flush.name}</h3>

            <div class="puntuacion">
              <p>Puntuacion: ${score(flush.score)}</p>
              <p>${condition(flush.score)}</p>
            </div>
            
            <p>Valoraciones totales: ${flush.rating}</p>

            <div class="botones">
              <label class="container">
                <input type="checkbox" name="voto" class="like">
                <svg class="like" id="Glyph" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <path d="M29.845,17.099l-2.489,8.725C26.989,27.105,25.804,28,24.473,28H11c-0.553,0-1-0.448-1-1V13  c0-0.215,0.069-0.425,0.198-0.597l5.392-7.24C16.188,4.414,17.05,4,17.974,4C19.643,4,21,5.357,21,7.026V12h5.002  c1.265,0,2.427,0.579,3.188,1.589C29.954,14.601,30.192,15.88,29.845,17.099z" id="XMLID_254_"></path><path d="M7,12H3c-0.553,0-1,0.448-1,1v14c0,0.552,0.447,1,1,1h4c0.553,0,1-0.448,1-1V13C8,12.448,7.553,12,7,12z   M5,25.5c-0.828,0-1.5-0.672-1.5-1.5c0-0.828,0.672-1.5,1.5-1.5c0.828,0,1.5,0.672,1.5,1.5C6.5,24.828,5.828,25.5,5,25.5z" id="XMLID_256_"></path>
                </svg>
              </label>

              <label class="container">
                <input type="checkbox" name="voto" class="dislike">
                <svg class="dislike" id="Glyph" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <path d="M2.156,14.901l2.489-8.725C5.012,4.895,6.197,4,7.528,4h13.473C21.554,4,22,4.448,22,5v14  c0,0.215-0.068,0.425-0.197,0.597l-5.392,7.24C15.813,27.586,14.951,28,14.027,28c-1.669,0-3.026-1.357-3.026-3.026V20H5.999  c-1.265,0-2.427-0.579-3.188-1.589C2.047,17.399,1.809,16.12,2.156,14.901z" id="XMLID_259_"></path><path d="M25.001,20h4C29.554,20,30,19.552,30,19V5c0-0.552-0.446-1-0.999-1h-4c-0.553,0-1,0.448-1,1v14  C24.001,19.552,24.448,20,25.001,20z M27.001,6.5c0.828,0,1.5,0.672,1.5,1.5c0,0.828-0.672,1.5-1.5,1.5c-0.828,0-1.5-0.672-1.5-1.5  C25.501,7.172,26.173,6.5,27.001,6.5z" id="XMLID_260_"></path>
                </svg>
              </label>              
            </div>

          </div>
        `;


        // Añade eventos de clic a los botones del popup para incrementar o disminuir la puntuación del marcador
        divPopup.querySelector(".container input.like").addEventListener("click",()=>{
          console.log("Like");
          console.log(flush);
          updateScore(flush._id, true)
          successToast("Voto hecho correctamente")
        });

        divPopup.querySelector(".container input.dislike").addEventListener("click",()=>{
          console.log("Dislike");
          console.log(flush);
          updateScore(flush._id, false)
          successToast("Voto hecho correctamente")
        });

        // Asocia el popup al marcador y agrega un evento de clic al marcador para actualizar el estado global
        marker.bindPopup(divPopup);
        marker.on('click',()=>{
          store.state.selectedCardName = flush.name;
        });

        console.log(flush);
      }
    })

    // Cierra el popup al mover el mapa
    map.value.on('moveend', () => {
      map.value.closePopup();
    });

    console.log('Map initialized with custom markers');
  } catch (error) {
    console.error('Error fetching flush list:', error);
  }
};


// Función para actualizar la puntuación de un marcador
function updateScore(flushId, shouldIncrement) {

  // Realiza una solicitud PUT a la API para actualizar la puntuación del marcador
  fetch(`${VUE_APP_API_URL}flush/${flushId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ increment: shouldIncrement }),
  })
    .then(response => {
      // Maneja la respuesta de la solicitud
      if (response.status === 410) { // Verifica si el recurso ha sido eliminado (estado 410)
        return { message: 'Objeto eliminado' };
      } else if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Maneja los datos obtenidos de la respuesta
      if (data.message) { // Verifica si hay un mensaje en los datos
        console.log(data.message);
      } else {
        console.log('Actualización exitosa', data);
      }
    })
    .catch(error => {
      console.error('Error al actualizar la puntuación', error);
    });
}


// Función para vigilar la ubicación del usuario y actualizar el mapa en consecuencia
const watchUserLocation = () => {
  const watchOptions = {
    enableHighAccuracy: true, // Habilita la máxima precisión posible para la ubicación
    maximumAge: 30000, // Establece el tiempo máximo en milisegundos que se pueden usar datos de caché de la ubicación
    timeout: 27000, // Establece el tiempo máximo en milisegundos antes de que se produzca un error debido a la ubicación no disponible
  };

  // Opciones de seguimiento de la ubicación del usuario
  const onLocationUpdate = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;

    // Verifica si userMarker.value está definido antes de actualizar su posición
    if (userMarker.value) {
      userMarker.value.setLatLng([latitude, longitude]);

      // Centra el mapa en la nueva ubicación del usuario
      if (!isInitialPosSet.value) {
        // Guarda la última ubicación conocida del usuario en las preferencias
        Preferences.set({
          key: 'userLastLocation', value: JSON.stringify({
            latitude,
            longitude
          })
        });
        // Centra el mapa en las nuevas coordenadas del usuario y ajusta el zoom al valor predeterminado si es necesario
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

  // Define las coordenadas iniciales del usuario como un objeto de tipo LatLngTuple que representa un par de coordenadas geográficas según la biblioteca Leaflet
  const initialCoordinates: L.LatLngTuple = [props.latitude, props.longitude];
  // Define el ícono del marcador del usuario con sus propiedades
  const userMarkerIcon = L.icon({
    iconUrl: currentMarkerIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // Agrega el marcador del usuario al mapa si el mapa ya está inicializado
  if (map.value) {
    userMarker.value = L.marker(initialCoordinates, { icon: userMarkerIcon }).addTo(map.value as L.Map);
  } else {
    // Si el mapa aún no está inicializado, espera hasta que lo esté y luego agrega el marcador del usuario
    const unwatch = watch(() => map.value, (newValue) => {
      if (newValue) {
        userMarker.value = L.marker(initialCoordinates, { icon: userMarkerIcon }).addTo(newValue as L.Map);
        unwatch(); // Detiene la observación una vez que se ha agregado el marcador del usuario
      }
    });
  }

  // Inicia la observación de la ubicación del usuario para actualizar el mapa
  watchUserLocation();

});

// Observa los cambios en las propiedades 'props' y ajusta la vista del mapa en consecuencia
watch(props, () => {
  const initialCoordinates: L.LatLngTuple = [props.latitude, props.longitude];
  map.value?.setView(initialCoordinates, 17);
});

// Función para manejar el evento de clic en el mapa y agregar un marcador en las coordenadas correspondientes
const registerFormHandler = (latitude: number, longitude: number) => {
  // Actualiza las coordenadas de ubicación en el servicio de ubicación
  locationService.state.latitude=latitude;
  locationService.state.longitude=longitude;

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    // Crea un nuevo evento personalizado 'map-click' con las coordenadas del marcador
    const event = new CustomEvent('map-click', {
      detail: { lat: latitude, lng: longitude }    
    });
    // Cuando se dispara este evento, cualquier listener que esté escuchando ese evento en el formulario de registro se activará y ejecutará su función asociada.
    registerForm.dispatchEvent(event);
  }
}; 

// Variable para rastrear el marcador actual en el mapa
const addMarker = (coordinates: L.LatLng) => {
  if (map.value) {
    // Elimina el marcador actual si existe
    if (store.state.currentMarker!=null) {
      map.value.removeLayer(store.state.currentMarker); // Elimina el marcador actual del mapa
      store.state.currentMarker = null; // Actualiza la referencia al marcador actual
    }
 
    // Define el ícono y sus propiedades para el nuevo marcador
    const onclickMarker = L.icon({
      iconUrl: blueMarker,
      iconSize: [29, 45],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
 
    // Crea un nuevo marcador en las coordenadas especificadas con el ícono definido
    const marker = L.marker(coordinates, { icon: onclickMarker }).addTo(map.value as L.Map);
 
    store.state.currentMarker = marker; // Actualiza la referencia al marcador actual
 
    // Agrega el marcador al formulario o realiza otras acciones necesarias
    registerFormHandler(coordinates.lat, coordinates.lng);
  }
};

// Observa el estado de la lista y agrega o elimina un marcador
watch(()=>store.state.showList,()=>{
  //Si se está mostrando la lista, el marcador se elimina
  if(store.state.showList) map.value.removeLayer(store.state.currentMarker);
  else{
    map.value?.on('click', (event: L.LeafletMouseEvent) => {
    // Si 'showList' es falso, agrega un marcador en las coordenadas pulsadas
    if(!store.state.showList) addMarker(event.latlng);
    else{
      // Elimina el marcador actual del mapa
      map.value.removeLayer(store.state.currentMarker);
    } 
  });
  }
})

</script>



<style>
#map {
  width: 100%;
  height: 100%;
}

.popup .botones,.puntuacion{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.puntuacion{
  gap: 10px;
}

.popup .container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.popup .container {
  display: block;
  position: relative;
  cursor: pointer;
  user-select: none;
}

svg {
  position: relative;
  top: 0;
  left: 0;
  height: 30px;
  width: 30px;
}

svg.like{
  fill: #00b809;
}

svg.dislike{
  fill: rgb(185, 51, 51);
}

</style>
