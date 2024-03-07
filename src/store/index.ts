import { createStore, createLogger } from 'vuex';

// Definición del almacenamiento Vuex para manejar el estado global de la aplicación
const store = createStore({
  state: {
    showList: true, // Estado para controlar la visualización de la lista de flushes
    flushcounter: null, // Contador de flushes
    selectedFlushName: null, // Nombre del flush seleccionado
    currentMarker: null,
  },
  mutations: {
    // Mutación para establecer el estado de visualización de la lista de flushes
    setShowList(state, newValue) {
      state.showList = newValue;
    },
    // Mutación para establecer el contador de flushes
    setFlushcounter(state, value) {
      state.flushcounter = value;
    },
    // Mutación para establecer el nombre del flush seleccionado
    setSelectedFlushName(state, name) { 
      state.selectedFlushName = name;
      console.warn("flush selected: "+name)
    },
  },
  actions: {
    // Acción para cambiar el estado de visualización de la lista de flushes
    toggleShowList({ commit, state }) {
      commit('setShowList', !state.showList);
    },
  },
  plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
});

export default store;
