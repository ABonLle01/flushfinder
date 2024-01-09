<template>
    <ion-list>
      <ion-card v-for="index in 8" :key="index">
        <ion-row class="item">
          <ion-col size="2">
            <ion-thumbnail>
              <div class="bath">
                <img alt="Imagen 3" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
              </div>
            </ion-thumbnail>

          </ion-col>
          <ion-col size="6">
            <div class="properties">
              <div class="details">
                <p>5.0 | </p>
                <p>Excelente | </p>
                <p>500M | </p>
                <p>Bruj</p>
              </div>
              <ion-title>Cesur Baño Este</ion-title>
              <div class="details">
                <ion-thumbnail>
                  <img alt="Imagen 3" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
                </ion-thumbnail>
                <ion-thumbnail>
                  <img alt="Imagen 3" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
                </ion-thumbnail>
                <ion-thumbnail>
                  <img alt="Imagen 3" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
                </ion-thumbnail>
              </div>
            </div>
          </ion-col>
        </ion-row>
      </ion-card>
    </ion-list>
  </template>
  
  <script>
  import { IonList, IonCard, IonRow, IonCol, IonThumbnail, IonTitle } from '@ionic/vue';
  
  export default {
    components: {
      IonList,
      IonCard,
      IonRow,
      IonCol,
      IonThumbnail,
      IonTitle,
    },
  };
  </script>
  
  <style scoped>
  div {
    border: solid;
    border-color: red;
  }
  
  .item {
    display: flex;
 /*    align-items: center; */ /* //falla, se pega al culo */
    justify-content: center;
    width: 80vh;
    border: solid;
    border-color:chartreuse;
  }
  .bath{
    border: solid;
    border-color: blueviolet;
    overflow: hidden;
    width: fit-content;
    
  }
  .item img {
    height: 100px;
    width: 100px;
    max-width: inherit;
    
  }
  
  .details {
    display: flex;
    justify-content: center;
  }
  
  .details img {
    height: 25px;
    width: 25px;
  }
  </style>
  