<template>
    <ion-list>
        <ion-item>
            <!-- label-placement="end" -->
            <img alt="Imagen 3" src="https://picsum.photos/1500/100" />
            <ion-checkbox v-model="discapacitados">Discapacitados</ion-checkbox>
        </ion-item>
        <ion-item>
            <img alt="Imagen 3" src="https://picsum.photos/1500/100" />
            <ion-checkbox v-model="salaLactancia">Sala de lactancia</ion-checkbox>
        </ion-item>
        <ion-item>
            <img alt="Imagen 3" src="https://picsum.photos/1500/100" />
            <ion-checkbox v-model="dePago">De pago</ion-checkbox>
        </ion-item>
    </ion-list>
</template>

<script lang="ts">
import { IonCheckbox } from '@ionic/vue';
import { defineComponent } from 'vue';

export default {
  data() {
    return {
      discapacitados: false,
      salaLactancia: false,
      dePago: false,
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
      // Aquí puedes realizar acciones basadas en los checkboxes seleccionados
      console.log('Discapacitados:', this.discapacitados);
      console.log('Sala de lactancia:', this.salaLactancia);
      console.log('De pago:', this.dePago);

      // Puedes mostrar u ocultar contenido según las selecciones
    },
  },
};
</script>

<style scoped>

img{
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 10px;
}

</style>