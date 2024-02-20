 
export interface LocationState {
    latitude: number | null;
    longitude: number | null;
  }
   
  const state: LocationState = {
    latitude: null,
    longitude: null,
  };
  
  const mapLocation: LocationState = {
    latitude: null,
    longitude:null,
  }

  export const locationService = {
    state, mapLocation,
  };