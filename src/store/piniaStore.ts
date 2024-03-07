import { defineStore } from "pinia"
import { Ref, ref } from "vue"
import { Filters } from "@/interfaces"
import { Geolocation } from '@ionic-native/geolocation';
import { Coordinates } from '@/interfaces';

// Definición del almacenamiento Vuex para manejar los filtros
export const useFilterStore = defineStore('filters', () => {
  // Referencia reactiva para almacenar los filtros
  const filters: Ref<Filters> = ref({
      handicapped: false,
      changingstation: false,
      free: false
  })
  // Función para establecer los filtros
  const setFilters = (newFilters) => {
      filters.value = newFilters
  }

  return { filters, setFilters }
})

// Definición del almacenamiento Vuex para manejar la ubicación
export const useLocationStore = defineStore('location', {
  state: () => ({
    currentLocation: null,
  }),
  actions: {
    setCurrentLocation(location) {
      this.currentLocation = location;
    },
  },
});

// Definición del almacenamiento Vuex para manejar los toasts
export const useToastStore = defineStore('toast', {
  state() {
    return {
      errors: [] as string[],
    };
  },
  actions: {
    showToast(message: string) {
      this.errors.push(message);
    },
    addError(error: string) {
      this.errors.push(error);
    },
    clearErrors() {
      this.errors = [];
    },
    hasErrors() {
      return this.errors.length > 0;
    }
  },
});

// Función que redondea la puntuación a un decimal
export const score = (x:number):string=>{
  return x.toFixed(1);
};

// Función que devuelve el estado de limpieza según una puntuación
export const condition = (x: number): string => {
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
