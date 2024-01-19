<template>
  <ion-list>
    <ion-card v-for="(flush, index) in flushList" :key="index" class="card">
      <ion-row>

        <ion-col size="3" class="col">
          <ion-thumbnail>
            <div class="bath">
              <img alt="BathLogo" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
            </div>
          </ion-thumbnail>
        </ion-col>

        <ion-col size="7" class="col">
          
          <div class="properties">
            <ion-row class="data">
                <p>
                  {{ flush.score }} | {{ flush.condition }} | 
                  <!-- {{ flush.latitude + flush.longitude }} --> distancia
                </p>
            </ion-row>

            <ion-row>
              <ion-title class="name">{{ flush.name }}</ion-title>
            </ion-row>

            <ion-row class="filters">
                <ion-row>
                  
                  <ion-col>
                    <ion-thumbnail v-if="flush.handicapped" class="icon">
                      <img alt="handicapped" src="../images/filters/handicapped.png" />
                    </ion-thumbnail>
                  </ion-col>

                  <ion-col>
                    <ion-thumbnail v-if="flush.changingstation" class="icon">
                      <img alt="changingstation" src="../images/filters/babychanger.png" />
                    </ion-thumbnail>
                  </ion-col>

                  <ion-col size="3">
                    <ion-thumbnail v-if="!flush.free" class="icon">
                      <img alt="Free" src="../images/filters/free.png" />
                    </ion-thumbnail>
                  </ion-col>

                </ion-row>  
            </ion-row>

          </div>
        </ion-col>
      </ion-row>
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

.card {
  justify-content: flex-start;
  align-items: center;
  margin-top: 0;
}
.bath img{
  max-height: 100px;
  max-width: 100px;
  min-width: 100px;
  min-height: 100px;
  border-radius: 15px;
}

.col {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.filters img {
  height: 35px;
  width: 35px;
}

.name {
  margin: 0;
  font-size: 1.2rem;
  width: 100%;
}

.data {
  margin: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* .card {
  justify-content: flex-start;
  align-items: center;
  margin-top: 0;
}

.col {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.filters img {
  height: 8vw;
  width: 8vw;
}

.name {
  margin: 0;
  font-size: 1.2rem;
  width: 100%;
}

.data {
  margin: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
} */


@media screen and (min-width: 696px) {
  .card {
    height: 25vh;
    gap: 5px;
  }

  .card img {
    width: 100%; 
    height: auto;
  }
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
  