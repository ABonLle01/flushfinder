<template>
  <ion-list>
    <ion-card v-for="(flush, index) in flushList" :key="index" class="card">
      <ion-row>

        <ion-col size="3" class="col">
          <ion-thumbnail>
            <div class="bath">
              <img alt="BathLogo" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
            </div>
            <p class="title">Cesur Baño Este</p>
            <div class="details">
              <img alt="Imagen 3" src="https://picsum.photos/100/50" />
              <img alt="Imagen 3" src="https://picsum.photos/100/50" />
              <img alt="Imagen 3" src="https://picsum.photos/100/50" />
            </div>
      </div>
    </ion-card>
  </ion-list>
</template>
  
<script setup lang="ts">
import { IonList, IonCard, IonRow, IonCol, IonThumbnail, IonTitle } from '@ionic/vue';

defineProps({
  flushList: {
    type: Array<any>
  }
})

const getFlushDistance = (lat:number, long:number) => {
// hacer cosas
}


</script>
  
<style scoped>


.card{
  justify-content: center;
  align-items: center;

  margin-top: 0;
}

.col{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.filters{
  display: flex;
  flex-direction: row;
}

.filters img {
  height: 6vw;
  width: 6vw;
}
 /* 
 .item {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 0px;
  width: 100%;

  height: fit-content;
  justify-content: center;
  justify-items: start;
  padding: 5px;
}

.item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
}

.item .data {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-left: 20px;
}

.item .title {
  margin: 0;
  font-size: 1.2rem;
  width: 100%;
}

.item .filters {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.item .properties {
  align-self: center;
}

.filters img {
  height: 6vw;
  width: 6vw;
}
.filters{
  display: flex;
  flex-direction: row;
}

.icon{
  justify-content: center;
  align-items: center;
}
 */

@media screen and (min-width: 696px) {
  .card {
    height: 25vh;
    gap: 5px;
    grid-template-columns: 15vw 1fr;
  }

  .card img {
    width: 100%; 
    height: auto;
  }
}

</style>
  