<template>
  <ion-list>
    <ion-card v-for="(flush, index) in flushList" :key="index" class="card" v-bind:data-id="index">
      <ion-row>
        <ion-col size="3" class="col">
          <ion-thumbnail>
            <div class="bath">
              <img alt="BathLogo" v-bind:src="flush.image" />
            </div>
          </ion-thumbnail>
        </ion-col>

        <ion-col size="6">
          <div class="properties">
            <ion-row class="data">
              <p>
                {{ flush.score }} | {{ flush.condition }} | distancia
              </p>
            </ion-row>

            <ion-row>
              <ion-title class="name">{{ flush.name }}</ion-title>
            </ion-row>

            <ion-row class="filters">
              <ion-row>

                <ion-col>
                  <ion-thumbnail v-if="flush.handicapped" class="icon">
                    <img alt="handicapped" src="../images/handicapped.png" />
                  </ion-thumbnail>
                </ion-col>

                <ion-col>
                  <ion-thumbnail v-if="flush.changingstation" class="icon">
                    <img alt="changingstation" src="../images/babychanger.png" />
                  </ion-thumbnail>
                </ion-col>

                <ion-col size="3">
                  <ion-thumbnail v-if="!flush.free" class="icon">
                    <img alt="Free" src="../images/free.png" />
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

</script>
  
<style scoped>

.card {
  justify-content: center;
  align-items: center;
  margin-top: 0;
}

.col {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;
  width: 50px;
}

.bath {
  display: flex;
  align-items: center;
  height: 100px; /* Ajustar según sea necesario */
  width: 100px;
}

.bath img {
  display: flex;
  height: 100px; /* Ajustar según sea necesario */
  width: 100px;
  margin: auto; /* Esto centra verticalmente la imagen */
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
}

</style>

  