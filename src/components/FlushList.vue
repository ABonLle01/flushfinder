<template>
  <ion-list>
    <ion-card v-for="(flush, index) in flushList" :key="index">
      <div class="item">
        <img alt="Imagen 3" src="https://picsum.photos/1500/700" />
        <div class="data">
          <span>5.0</span>
          <span>Excelente</span>
          <span>500M</span>
          <span>Bruj</span>
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

const getFlushDistance = (lat, long) => {
// hacer cosas
}

</script>
  
<style scoped>
 
.item{
  display:grid;
  grid-template-rows: auto 0fr auto;
  grid-template-columns: 25vw  1fr;
  grid-template-areas: "imagen cabecera" 
                       "imagen titulo" 
                       "imagen detalles";
  gap:5px;
  justify-items: center;
  align-items: center;
  margin-top: 0px;
  width: 100vw;
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
@media screen and (min-width: 700px){

  .item{
    height: 100px;
  }


}


</style>
  