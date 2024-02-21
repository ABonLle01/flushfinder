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
    const response = await fetch(url); // Obtiene los datos de los marcadores desde la API
    const flushList = await response.json(); // Convierte la respuesta a formato JSON

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
          <h3>${flush.name}</h3>
          <p>Puntuacion: ${flush.score}</p>
          <p>Estado: ${condition(flush.score)}</p>
          <p>Valoraciones: ${flush.rating}</p>
          <button class="inc">Incrementar Puntuación</button>
          <button class="dec">Disminuir Puntuación</button>
          `;

        // Añade eventos de clic a los botones del popup para incrementar o disminuir la puntuación del marcador
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

// Función que devuelve el estado de limpieza según una puntuación
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


const isMarkerAdded = ref(false); // Nuevo estado para rastrear si se ha agregado un marcador

let currentMarker: L.Marker | null = null; // Variable para rastrear el marcador actual en el mapa

const addMarker = (coordinates: L.LatLng) => {
  if (map.value) {
    // Elimina el marcador actual si existe
    if (currentMarker) {
      map.value.removeLayer(currentMarker); // Elimina el marcador actual del mapa
      currentMarker = null; // Actualiza la referencia al marcador actual
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
 
    currentMarker = marker; // Actualiza la referencia al marcador actual
 
    // Agrega el marcador al formulario o realiza otras acciones necesarias
    registerFormHandler(coordinates.lat, coordinates.lng);
  }
};

// Observa el evento de clic en el mapa y agrega o elimina un marcador según el estado de 'showList' en el almacenamiento
watchEffect(() => {
  map.value?.on('click', (event: L.LeafletMouseEvent) => {
    // Si 'showList' es falso, agrega un marcador en las coordenadas pulsadas
    if(!store.state.showList) addMarker(event.latlng);
    else{
      // Elimina el marcador actual del mapa
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
