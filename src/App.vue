<template>
  <ion-app>
    <!-- Menu de filtros -->
    <ion-menu content-id="main-content">
      <ion-header>
        <ion-toolbar color="undefined">
          <div class="header">
            <img class="logo" alt="Imagen 3" src="/favicon.png" />
            <ion-title color="dark">FlushFinder</ion-title>
          </div>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <Filters  />
      </ion-content>
    </ion-menu>

    <!-- "Menu" de navegacion -->
    <ion-page id="main-content">
      <ion-header>
        <ion-toolbar>
          <!-- boton de añadir -->
          <ion-fab horizontal="end" vertical="center">
            <ion-fab-button size="small" color="undefined" @click="toggleShowList()">
              <ion-icon :icon="add"></ion-icon>
            </ion-fab-button>
          </ion-fab>

          <!-- boton de filtros -->
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          
          <!-- barra de navegacion -->
          <!-- <div class="bar">
            <ion-searchbar class="searchBar" v-model="searchTerm" @ionChange="onSearchChange"></ion-searchbar>
          </div> -->
          

        </ion-toolbar>
      </ion-header>

    
    <!-- mapa + lista -->
    <ion-content class="ion-padding"> 
      <!-- :updatedList="updatedList" -->
      <router-view ></router-view>
    </ion-content>
  </ion-page>
  </ion-app>



</template>



<script setup lang="ts">
import Filters from './components/Filters.vue';
import { add } from 'ionicons/icons';
import {IonApp, IonHeader, IonContent, IonIcon, IonMenu, IonFab, IonFabButton, IonToolbar, IonButtons, IonMenuButton, IonSearchbar, IonPage, IonTitle} from '@ionic/vue';
import { ref } from 'vue';

import {archiveOutline, archiveSharp, heartOutline, heartSharp, mailOutline, mailSharp,
   paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, 
   warningOutline, warningSharp} from 'ionicons/icons';

import { useStore } from 'vuex';

import { useRouter } from 'vue-router';

const router = useRouter();

const selectedIndex = ref(0);
const appPages = [
  {
    title: 'Inbox',
    url: '/folder/Inbox',
    iosIcon: mailOutline,
    mdIcon: mailSharp,
  },
  {
    title: 'Outbox',
    url: '/folder/Outbox',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp,
  },
  {
    title: 'Favorites',
    url: '/folder/Favorites',
    iosIcon: heartOutline,
    mdIcon: heartSharp,
  },
  {
    title: 'Archived',
    url: '/folder/Archived',
    iosIcon: archiveOutline,
    mdIcon: archiveSharp,
  },
  {
    title: 'Trash',
    url: '/folder/Trash',
    iosIcon: trashOutline,
    mdIcon: trashSharp,
  },
  {
    title: 'Spam',
    url: '/folder/Spam',
    iosIcon: warningOutline,
    mdIcon: warningSharp,
  },
];
const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const path = window.location.pathname.split('folder/')[1];
if (path !== undefined) {
  selectedIndex.value = appPages.findIndex((page) => page.title.toLowerCase() === path.toLowerCase());
}

const store = useStore();

const toggleShowList = () => {
  store.dispatch('toggleShowList');
  
};

</script>

<style scoped>

/* Darle color a la parte principal cuando se despliega el menu */
/*   ion-menu::part(backdrop) {
    background-color: rgba(47, 253, 20, 0.5);
  }

ion-menu::part(container) {
  border-radius: 0 20px 20px 0;

  box-shadow: 4px 0px 16px rgba(157, 255, 0, 0.397);
}  */


.header{
  display: flex;
  flex-direction: row;
  margin-left: 4.5px;
}

.logo{
  width: 2.7rem;
  height: 3rem;
  padding: 5px;
  padding-right: 0;
}

.bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: -70px;
}

.searchBar {
  width: 68vw;
  /* max-width: 300px; */ 
}


ion-fab-button{
  --box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
}

ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>
