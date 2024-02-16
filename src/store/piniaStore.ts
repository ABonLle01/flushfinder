import { defineStore } from "pinia"
import { Ref, ref } from "vue"
import { Filters } from "@/interfaces"



export const useFilterStore = defineStore('filters', () => {
    const filters: Ref<Filters> = ref({
        handicapped: false,
        changingstation: false,
        free: false
    })

    const setFilters = (newFilters) => {
        filters.value = newFilters
    }

    return { filters, setFilters }
})

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