<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <div class="container" >
        
        <div class="map">
          <MapViewer />
        </div>

        <div class="list">
          <FlushList :flushList="flushList" />
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>



<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import FlushList from '@/components/FlushList.vue';
import MapViewer from '@/components/MapViewer.vue';
import { getFlushList } from '@/services'
import { onMounted, ref, watchEffect } from 'vue';

const flushList = ref([]);
const isHorizontal = ref(false);

onMounted(async () => {
  flushList.value = await getFlushList();
});

watchEffect(() => {
  console.log('isHorizontal:', !isHorizontal.value);
});


window.addEventListener('orientationchange', () => {
  isHorizontal.value = window.matchMedia('(orientation: landscape)').matches;
});

</script>


<style scoped>

.map{
  height: 44vh;
  position: sticky;
  top: 0;
  z-index: 9;
}

/* .list{
  border: solid;
  border-color: blue; 
} */

.container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  border: solid 3px green;
}

</style>
