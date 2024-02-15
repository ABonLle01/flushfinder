<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $route.params.id }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="map">
        <MapViewer />
      </div>
      <div class="container">
        
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
import { ref } from 'vue';

const flushList = ref([]);

</script>

<style scoped>
.map{
  position: sticky;
  position: relative;
  border: solid;
  border-color: red;
}
.list{
  border: solid;
  border-color: blue;
}
.container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  /*top: 34%;*/  
  /* transform: translateY(-50%); */


  border: solid;
  border-color: green;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
