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