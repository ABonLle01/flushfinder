import { createStore, createLogger } from 'vuex';
import { Geolocation } from '@ionic-native/geolocation';
import { ref } from 'vue';
import { Coordinates } from '@/interfaces';

// Definición del almacenamiento Vuex para manejar el estado global de la aplicación
const store = createStore({
  state: {
    showList: true, // Estado para controlar la visualización de la lista de flushes
    flushcounter: 20, // Contador de flushes
    selectedFlushName: null, // Nombre del flush seleccionado
  },
  mutations: {
    // Mutación para establecer el estado de visualización de la lista de flushes
    setShowList(state, newValue) {
      state.showList = newValue;
    },
    // Mutación para establecer el contador de flushes
    setFlushcounter(state, value) {
      state.flushcounter = value;
    },
    // Mutación para establecer el nombre del flush seleccionado
    setSelectedFlushName(state, name) { 
      state.selectedFlushName = name;
      console.warn("flush selected: "+name)
    },
  },
  actions: {
    // Acción para cambiar el estado de visualización de la lista de flushes
    toggleShowList({ commit, state }) {
      commit('setShowList', !state.showList);
    },
  },
  plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
});

export default store;


// Función para calcular la distancia entre dos puntos utilizando la fórmula de Haversine
export function haversineDistance(pointA: Coordinates, pointB: Coordinates): number {
  var radius = 6371;

  // Diferencia en latitud y longitud entre los dos puntos, en radianes
  const deltaLatitude = (pointB.latitude - pointA.latitude) * Math.PI / 180;
  const deltaLongitude = (pointB.longitude - pointA.longitude) * Math.PI / 180;

  // Fórmula de Haversine para calcular la distancia
  const halfChordLength = Math.cos(
      pointA.latitude * Math.PI / 180) * Math.cos(pointB.latitude * Math.PI / 180) 
      * Math.sin(deltaLongitude/2) * Math.sin(deltaLongitude/2)
      + Math.sin(deltaLatitude/2) * Math.sin(deltaLatitude/2);

  const angularDistance = 2 * Math.atan2(Math.sqrt(halfChordLength), Math.sqrt(1 - halfChordLength));

  // Distancia final entre los dos puntos
  return radius * angularDistance;
}


// Variable reactiva para almacenar la ubicación actual del usuario
const currentLocation = ref({ latitude: 0, longitude: 0 });
// Función para obtener la ubicación actual del usuario utilizando el objeto Geolocation del navegador
export const getCurrentLocation = () => {
  Geolocation.getCurrentPosition().then((resp) => {
    currentLocation.value = {
      latitude: resp.coords.latitude,
      longitude: resp.coords.longitude
    };

  }).catch((error) => {
    console.error('Error getting location', error);
  });
};

// Función para obtener las coordenadas de un clic en el mapa
export const getClickedCoord = (map) =>{
  map.value?.on('click', (event: L.LeafletMouseEvent) => {
    // Obtiene las coordenadas del clic
    const clickedLat = event.latlng.lat;
    const clickedLong = event.latlng.lng;
  });
}