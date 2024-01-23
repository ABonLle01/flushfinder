<template>
  <ion-list>
    <ion-item :inset="true" id="ejemplo">
      <!-- label-placement="end" -->
      <img alt="Handicapped" src="../images/filters/handicapped.png" />
      <ion-checkbox label-placement="end" justify="start" id="handicapped" value="handicapped" v-model="filtros.handicapped">Discapacitados</ion-checkbox>
    </ion-item>
    <ion-item>
      <img alt="BabyChanger" src="../images/filters/babychanger.png" />
      <ion-checkbox label-placement="end" justify="start" id="babychanger" value="babychanger" v-model="filtros.babychanger">Sala de lactancia</ion-checkbox>
    </ion-item>
    <ion-item lines="none">
      <img alt="Free" src="../images/filters/free.png" />
      <ion-checkbox label-placement="end" justify="start"  id="free" value="free" v-model="filtros.free">De pago</ion-checkbox>
    </ion-item>
    <br />
    <span>Checked names: {{ filtros }}</span>
    <ion-button @click="logFiltros">Mostrar Filtros</ion-button>
  </ion-list>
</template>


<script setup lang="ts">
import { IonList, IonItem, IonCheckbox, IonButton } from '@ionic/vue';
import { ref } from 'vue';

const filtros = ref({
  handicapped: false,
  babychanger: false,
  free: false,
});


const logFiltros = () => {
  console.log(filtros.value);
  /* console.log(filtros.value.handicapped);
  console.log(filtros.value.babychanger);
  console.log(filtros.value.free); */

};


/* import { IonCheckbox } from '@ionic/vue';
import { defineComponent } from 'vue';

export default {
  data() {
    return {
      discapacitados: false,
      salaLactancia: false,
      dePago: '',
    };
  },
  watch: {
    discapacitados() {
      this.actualizarContenido();
    },
    salaLactancia() {
      this.actualizarContenido();
    },
    dePago() {
      this.actualizarContenido();
    },
  },
  methods: {
    actualizarContenido() {
      
      console.log('Discapacitados:', this.discapacitados);
      console.log('Sala de lactancia:', this.salaLactancia);
      console.log('De pago:', this.dePago);

    },
  },
}; */

/* export default {
    data() {
        return {
            filtros: {
                discapacitados: false,
                salaLactancia: false,
                dePago: false
            }
        };
    }
}; */





</script>

<style scoped>

img{
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 10px;
}

ion-button{
  position: absolute;
  left: 12dvw;
}
</style>