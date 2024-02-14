import { createStore, createLogger } from 'vuex';
import { Geolocation } from '@ionic-native/geolocation';
import { ref } from 'vue';
import { Coordinates } from '@/interfaces';

const store = createStore({
  state: {
    showList: true,
    flushcounter: 20,
    selectedFlushName: null,
  },
  mutations: {
    setShowList(state, newValue) {
      state.showList = newValue;
    },
    setFlushcounter(state, value) {
      state.flushcounter = value;
    },
    setSelectedFlushName(state, name) { 
      state.selectedFlushName = name;
    },
  },
  actions: {
    toggleShowList({ commit, state }) {
      commit('setShowList', !state.showList);
      /* console.log(state.showList); */
    },
  },
  plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
});

export default store;




/* Calculo de coordenadas */

export function haversineDistance(pointA: Coordinates, pointB: Coordinates): number {
  var radius = 6371;

  const deltaLatitude = (pointB.latitude - pointA.latitude) * Math.PI / 180;
  const deltaLongitude = (pointB.longitude - pointA.longitude) * Math.PI / 180;

  const halfChordLength = Math.cos(
      pointA.latitude * Math.PI / 180) * Math.cos(pointB.latitude * Math.PI / 180) 
      * Math.sin(deltaLongitude/2) * Math.sin(deltaLongitude/2)
      + Math.sin(deltaLatitude/2) * Math.sin(deltaLatitude/2);

  const angularDistance = 2 * Math.atan2(Math.sqrt(halfChordLength), Math.sqrt(1 - halfChordLength));

  return radius * angularDistance;
}


/* Ubicacion actual */

const currentLocation = ref({ latitude: 0, longitude: 0 });

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


