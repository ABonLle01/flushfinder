<template>
  <div class="title">
    <img src="../images/filters/filtros.png" alt="icono">
    <p>Filtros de búsqueda</p>
  </div>
  
  <div class="list">
    <div class="item" :inset="true" id="ejemplo">
      <img alt="Handicapped" src="../images/filters/handicapped.png" />
      <ion-checkbox label-placement="end" justify="start" id="handicapped" value="handicapped" v-model="filtros.handicapped">Discapacitados</ion-checkbox>
    </div>
    <div class="item">
      <img alt="Changingstation" src="../images/filters/babychanger.png" />
      <ion-checkbox label-placement="end" justify="start" id="changingstation" value="changingstation" v-model="filtros.changingstation">Sala de lactancia</ion-checkbox>
    </div>
    <div class="item" lines="none">
      <img alt="Free" src="../images/filters/free.png" />
      <ion-checkbox label-placement="end" justify="start"  id="free" value="free" v-model="filtros.free">De pago</ion-checkbox>
    </div>
  </div>
</template>


<script setup lang="ts">
import { IonCheckbox } from '@ionic/vue';
import { ref, Ref, watch } from 'vue';
import { Filters } from '@/interfaces';
import { useFilterStore } from '@/store/piniaStore';

const filtersStore = useFilterStore();

const filtros: Ref<Filters> = ref({
  handicapped: false,
  changingstation: false,
  free: false,
});

watch(filtros.value, () => {
  filtersStore.setFilters(filtros.value);
})

</script>

<style scoped>

img{
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 10px;
}

.title{
  display: inline-flex;
  align-items: center;
  margin-left: 18px;

  color: #8a2be2;
}

.title>p{
  font-size: larger;
  font-weight: bold;
}

.item{
  display: flex;
  position: relative;
  align-items: center;

  padding: 20px 20px;

  border-bottom: solid 0.3px rgba(146, 146, 146, 0.4);
}

.item:last-child{
  border-bottom: none;
}

</style>