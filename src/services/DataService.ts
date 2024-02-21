// Interfaz que define el estado de la ubicación, con propiedades para la latitud y la longitud
export interface LocationState {
  latitude: number | null; // Latitud, puede ser un número o nulo si no está disponible
  longitude: number | null; // Longitud, puede ser un número o nulo si no está disponible
}
 
// Estado inicial para la ubicación, ambas propiedades se inicializan como nulas
const state: LocationState = {
  latitude: null,
  longitude: null,
};

// Estado para la ubicación en el mapa, ambas propiedades se inicializan como nulas
const mapLocation: LocationState = {
  latitude: null,
  longitude: null,
}


export const locationService = {
  state, 
  mapLocation,
};
