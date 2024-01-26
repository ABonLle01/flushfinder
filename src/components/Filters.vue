<template>
  <div class="title">
    <img src="../images/filters/filtros.png" alt="icono">
    <p>Filtros de búsqueda</p>
  </div>
  <ion-list>
    <ion-item :inset="true" id="ejemplo">
      <img alt="Handicapped" src="../images/filters/handicapped.png" />
      <ion-checkbox label-placement="end" justify="start" id="handicapped" value="handicapped" v-model="filtros.handicapped">Discapacitados</ion-checkbox>
    </ion-item>
    <ion-item>
      <img alt="Changingstation" src="../images/filters/babychanger.png" />
      <ion-checkbox label-placement="end" justify="start" id="changingstation" value="changingstation" v-model="filtros.changingstation">Sala de lactancia</ion-checkbox>
    </ion-item>
    <ion-item lines="none">
      <img alt="Free" src="../images/filters/free.png" />
      <ion-checkbox label-placement="end" justify="start"  id="free" value="free" v-model="filtros.free">De pago</ion-checkbox>
    </ion-item>
  </ion-list>
</template>


<script setup lang="ts">
import { IonList, IonItem, IonCheckbox, IonButton } from '@ionic/vue';
import { ref, Ref, watch, onMounted } from 'vue';
import { Filters } from '@/interfaces';
import { useFilterStore } from '@/store/useFiltersStore';

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

.button{
  display: flex;
  justify-content: center;

  width: 100%;

  margin-top: 2dvh;
}

.btn{
  width: 65%;
  font-weight: bold;
}

</style>