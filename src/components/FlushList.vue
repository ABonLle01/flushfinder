<template>
  <ion-list>
    <ion-card v-for="(flush, index) in flushList" :key="index">
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
              <p>{{ flush.score }} | </p>
              <p>{{ flush.condition }} | </p>
              <p>{{ flush.latitude, flush.longitude }}</p>
            </div>
            <ion-title>{{ flush.name }}</ion-title>
            <div class="details">
              <ion-thumbnail v-if="flush.handicapped">
                <img alt="handicapped" src="../images/handicapped.png" />
              </ion-thumbnail>
              <ion-thumbnail v-if="flush.changingstation">
                <img alt="changingstation" src="../images/babychanger.png" />
              </ion-thumbnail>
              <ion-thumbnail v-if="!flush.free">
                <img alt="Free" src="../images/free.png" />
              </ion-thumbnail>
            </div>
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

const getFlushDistance = (lat, long) => {
// hacer cosas
}

/*   export default {
    components: {
      IonList,
      IonCard,
      IonRow,
      IonCol,
      IonThumbnail,
      IonTitle,
    },
  }; */
</script>
  
<style scoped>
div {
  border: solid;
  border-color: red;
}

.item {
  display: flex;
  /*    align-items: center; */
  /* //falla, se pega al culo */
  justify-content: center;
  width: 80vh;
  border: solid;
  border-color: chartreuse;
}

.bath {
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
  