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
              <p>{{ flush.latitude + flush.longitude }}</p>
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
 
.item{
  display:grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 25vw  1fr;
  grid-template-areas: "imagen cabecera" 
                       "imagen titulo" 
                       "imagen detalles";
  gap:10px;
  justify-items: center;
  align-items: center;
  margin-top: 3px;
  width: 100vw;
}


.item img:hover{
  border: solid 3px red;
}

.item img{
  width:100%;
  height:100%;
  object-fit: cover;
  grid-area: imagen;
  border-radius:20px;
}

.item > .data{
  grid-area: cabecera;
  display: flex;
  gap:20px;
}
 
.item > *{
  margin:0;
}

.item > .title{
  grid-area: titulo;
  margin:0;
  font-size: 1.5rem;
}
 
.item > .details{
  grid-area: detalles;  display:flex;
  justify-content: center;
  gap:20px;
}
 
.item > .properties {
  align-self: center;
}

.details img{
  height:5vw;
  width: 5vw;
}
 
.item{
  height:25vw;
  justify-content: center;
  justify-items: start;
  padding:5px;
}

</style>
  