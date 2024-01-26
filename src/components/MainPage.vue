<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="container">
        <div class="map">
          <MapViewer :latitude="currentLocation.latitude" :longitude="currentLocation.longitude" />
        </div>

        <div class="list" v-if="showList">
          <Filters  @applyFilters="applyFilters"/>
          <FlushList :flushList="flushList" @setLocation="setLocation" />
        </div>
        <router-view class="form"></router-view>
      </div>
    </ion-content>
  </ion-page>
</template>



<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import FlushList from '@/components/FlushList.vue';
import MapViewer from '@/components/MapViewer.vue';
import Filters from '@/components/Filters.vue';

import { getFlushList } from '@/services';
import { onMounted, ref, watchEffect } from 'vue';
import { useRouter, RouteLocationNormalizedLoaded } from 'vue-router';
import { useStore } from 'vuex';

import { getCurrentLocation } from '@/store';

const store = useStore();
const showList = ref(store.state.showList);
const router = useRouter();
const flushList = ref([]);

const isHorizontal = ref(false);
const currentLocation = ref({ latitude: 0, longitude: 0 });

defineProps({
  updatedList: {
    type: Array,
    required: true,
  },
});

const applyFilters = (filtros) => {
  getFlushList(filtros.handicapped, filtros.changingstation, filtros.free)
    .then((updatedList) => {
      flushList.value = updatedList;
    })
    .catch((error) => {
      console.error('Error applying filters:', error);
    });
};

onMounted(() => {
  getFlushList(false, false, false).then((initialList) => {
    flushList.value = initialList;
  });
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

onMounted(() => {
  actualizarRuta();
});


watchEffect(() => {
  console.log('isHorizontal:', !isHorizontal.value);
});

window.addEventListener('orientationchange', () => {
  isHorizontal.value = window.matchMedia('(orientation: landscape)').matches;
});

onMounted(async () => {
  getCurrentLocation();
});

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
  /* border: solid 3px green; */
}



@media screen and (min-width: 696px) {
  /*   *:hover{
    border: solid 10px red;
  } */

  .container {
    display: -webkit-box;
    flex-direction: row;
  }

  .map {
    width: 44vw;
    height: 100vh;
    position: sticky;
  }

  .list {
    width: 56vw;
    height: 100vw;
  }

  .form{
    position: sticky
  }

}
</style>
