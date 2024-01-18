<template>
  <ion-list>
    <ion-item :inset="true" id="ejemplo">
      <!-- label-placement="end" -->
      <img alt="Imagen 3" src="https://picsum.photos/1500/100" />
      <input type="checkbox" id="discapacitados" value="discapacitados" v-model="filtros" />
      <label for="discapacitados">Discapacitados</label>
    </ion-item>
    <ion-item>
      <img alt="Imagen 3" src="https://picsum.photos/1500/100" />
      <input type="checkbox" id="lactancia" value="lactancia" v-model="filtros" />
      <label for="lactancia">Sala de lactancia</label>
    </ion-item>
    <ion-item lines="none">
      <img alt="Imagen 3" src="https://picsum.photos/1500/100" />
      <input type="checkbox" id="dePago" value="dePago" v-model="filtros" />
      <label for="dePago">De pago</label>
    </ion-item>
    <br />
    <span>Checked names: {{ filtros }}</span>
  </ion-list>
</template>


<script setup lang="ts">
import { IonList, IonItem } from '@ionic/vue';
import { ref } from 'vue';
const filtros = ref([]); 



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

</style>