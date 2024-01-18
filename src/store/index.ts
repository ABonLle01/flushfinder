import { createStore, createLogger } from 'vuex';

const store = createStore({
  state: {
    showList: true,
  },
  mutations: {
    setShowList(state, newValue) {
      state.showList = newValue;
    },
  },
  actions: {
    toggleShowList({ commit, state }) {
      commit('setShowList', !state.showList);
      console.log(state.showList);
    },
  },
  plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
});

export default store;