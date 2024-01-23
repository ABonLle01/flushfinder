<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="container">
        <div class="map">
          <MapViewer :latitude="currentLocation.latitude" :longitude="currentLocation.longitude" />
        </div>

        <div class="list" v-if="showList">
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
import { Geolocation } from '@ionic-native/geolocation';
import { getFlushList } from '@/services';
import { onMounted, ref, watchEffect, computed } from 'vue';
import { useRouter, RouteLocationNormalizedLoaded } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const showList = ref(store.state.showList);
const router = useRouter();
const flushList = ref([]);

const isHorizontal = ref(false);
const currentLocation = ref({ latitude: 0, longitude: 0 });

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
  flushList.value = await getFlushList(false);
  getCurrentLocation();
});

const setLocation = ({ latitude, longitude }) => {
  console.log({ latitude, longitude })
  currentLocation.value = { latitude, longitude };
}

const getCurrentLocation = () => {
  Geolocation.getCurrentPosition().then((resp) => {
    currentLocation.value = {
      latitude: resp.coords.latitude,
      longitude: resp.coords.longitude
    };

/*     console.log('Latitude:', resp.coords.latitude);
    console.log('Longitude:', resp.coords.longitude); */
  }).catch((error) => {
    console.error('Error getting location', error);
  });
};



</script>




<style scoped>
.map {
  height: 44vh;
  position: sticky;
  top: 0;
  z-index: 9;
}

.list {
  height: 50vh;
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
