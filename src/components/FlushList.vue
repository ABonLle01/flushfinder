<template>
  <ion-list>
    <ion-card v-for="(flush, index) in flushList" :key="index" class="card" v-bind:data-id="index" @click="setLocation({
      latitude: Number(flush.latitude),
      longitude: Number(flush.longitude)
    })">
      <ion-row>

        <ion-col size="4" class="col">
          <div class="bath">
            <img alt="BathLogo" v-bind:src="flush.image" />
          </div>
        </ion-col>

        <ion-col size="8" class="col">

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
import { getFlushList } from '@/services';
import { IonList, IonCard, IonRow, IonCol, IonThumbnail, IonTitle } from '@ionic/vue';

defineProps({
  flushList: {
    type: Array<any>
  }
})

const emit = defineEmits(['setLocation'])

const setLocation = (args) => {
  emit('setLocation', args)
}
</script>
  
<style scoped>
.card {
  justify-content: flex-start;
  align-items: center;
  margin-top: 0;
  border-radius: 15px;
}

.bath {
  margin: auto;
  margin-left: 10px;
}

.bath img {
  height: 120px;
  width: 120px;
  border-radius: 15px;
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
  padding: 0;
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
} */


/* @media screen and (min-width: 696px) {
  .card {
    height: 25vh;
    gap: 5px;
  }

  .card img {
    width: 100%; 
    height: auto;
  }
}

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
} */
</style>
  