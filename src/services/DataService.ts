import { ref, Ref } from 'vue';
 
export interface LocationState {
    latitude: Ref<number | null>;
    longitude: Ref<number | null>;
  }
   
  const state: LocationState = {
    latitude: ref(null),
    longitude: ref(null),
  };
   
  export const locationService = {
    state,
  };