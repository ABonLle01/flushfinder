import { ref } from "vue";
import { locationService } from "./DataService";
import store from "@/store";

const getFlushList = async (handicapped: boolean, changingstation: boolean, free: boolean, latitude: number, longitude: number) => {

    locationService.mapLocation.latitude=latitude;
    locationService.mapLocation.longitude=longitude;

    try {
        let url = `https://api.flushfinder.es/flush?latitude=${latitude}&longitude=${longitude}`;
        /* let url = `http://localhost:3000/flush?latitude=${latitude}&longitude=${longitude}`; */
 
        if (handicapped) {
            url += '&handicapped=true';
        }
        if (changingstation) {
            url += '&changingstation=true';
        }
        if (free) {
            url += '&free=true';
        }
 
        const response = await fetch(url);
        console.log(url)
 
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
 
        const flushList = await response.json();
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