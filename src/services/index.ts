import { ref } from "vue";
import { locationService } from "./DataService";
import store from "@/store";

// URL de la API utilizada para obtener la lista de flushes
export const VUE_APP_API_URL='https://api.flushfinder.es/';

// Función asíncrona que obtiene la lista de flushes según los filtros y la ubicación proporcionados
const getFlushList = async (handicapped: boolean, changingstation: boolean, free: boolean, latitude: number, longitude: number) => {

    // Almacena la ubicación en el mapa en el servicio de ubicación
    locationService.mapLocation.latitude=latitude;
    locationService.mapLocation.longitude=longitude;

    try {
        let url = `${VUE_APP_API_URL}flush?latitude=${latitude}&longitude=${longitude}`;
 
        // Agrega los filtros a la URL si están habilitados
        if (handicapped) {
            url += '&handicapped=true';
        }
        if (changingstation) {
            url += '&changingstation=true';
        }
        if (free) {
            url += '&free=true';
        }
  
        // Realiza una solicitud GET a la API utilizando la URL construida
        const response = await fetch(url);
        console.log(url)
 
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        
        const flushList = await response.json();
        
        // Actualiza el contador de flushes en el estado global de la aplicación
        store.state.flushcounter=flushList.length
        console.log(flushList);
        return flushList;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener la lista de flushes');
    }
};
 
export {
    getFlushList
}