import { defineStore } from "pinia"
import { Ref, ref } from "vue"
import { Filters } from "@/interfaces"

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