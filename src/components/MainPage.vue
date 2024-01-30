<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="container">
        <div class="map">
          <MapViewer v-if="currentLocation" :latitude="currentLocation.latitude" :longitude="currentLocation.longitude" />
        </div>

        <div class="list" v-if="showList">
          <FlushList v-if="currentLocation" :flushList="flushList" :initialLocation="currentLocation" @setLocation="setLocation" />
        </div>

        <router-view class="form"></router-view>
      </div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import FlushList from '@/components/FlushList.vue';
import MapViewer from '@/components/MapViewer.vue';

import { getFlushList } from '@/services';
import { onMounted, ref, watch } from 'vue';
import { useRouter, RouteLocationNormalizedLoaded } from 'vue-router';
import { useStore } from 'vuex';

import { getCurrentLocation } from '@/store';
import { useLocationStore, useFilterStore } from '@/store/piniaStore';
import { Preferences } from '@capacitor/preferences';

const filtersStore = useFilterStore();

const store = useStore();
const showList = ref(store.state.showList);

const router = useRouter();
const flushList = ref([]);
const currentLocation = ref();
const currentLocationStore = useLocationStore();

const applyFilters = (filtros) => {
  getFlushList(filtros.handicapped, filtros.changingstation, filtros.free)
    .then((updatedList) => {
      flushList.value = updatedList;
    })
    .catch((error) => {
      console.error('Error applying filters:', error);
    });
};


watch(() => filtersStore.filters, () => {
    applyFilters(filtersStore.filters)
  }, { deep: true }
)


onMounted(async () => {
  let { value }: any = await Preferences.get({ key: 'userLastLocation' });
  value = JSON.parse(value)

  currentLocation.value = {
    latitude: value ? value.latitude : 0,
    longitude: value ? value.longitude : 0
  }

  getFlushList(false, false, false).then((initialList) => {
    flushList.value = initialList;
  });

  currentLocationStore.setCurrentLocation(currentLocation.value);

  getCurrentLocation();

});


onMounted(() => {
  store.watch(() => store.state.showList, (newValue) => {
    showList.value = newValue;
    actualizarRuta();
  });
});


const actualizarRuta = () => {
  const currentRoute: RouteLocationNormalizedLoaded | undefined = router.currentRoute.value;

  if (currentRoute) {
    const folderId = currentRoute.params.id ? `/${currentRoute.params.id}` : '/';
    const newPath = showList.value ? folderId : '/registro';
    router.push({ path: newPath });
  }
};

const setLocation = ({ latitude, longitude }) => {
  console.log({ latitude, longitude })
  currentLocation.value = { latitude, longitude };
}

</script>




<style scoped>
.map {
  height: 40vh;
  position: sticky;
  top: 0;
  z-index: 9;
}

.list {
  height: 100%;
  overflow-y: auto;
}

.container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  /* height: 100%; */
}



@media screen and (min-width: 1100px) {

  .container {
    display: -webkit-box;
    flex-direction: row;
  }

  .map {
    width: 44vw;
    height: 900px;
    position: sticky;
  }

  .list {
    width: 56vw;
    height: 100vw;
  }

  .form {
    position: sticky
  }

}


</style>
