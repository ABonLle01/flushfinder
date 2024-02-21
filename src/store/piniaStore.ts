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