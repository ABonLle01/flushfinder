<template>
    <ion-list>
        <ion-item>
            <img alt="Imagen 3" src="https://picsum.photos/100/50" />
            <ion-checkbox label-placement="end">Discapacitados</ion-checkbox>
        </ion-item>
        <ion-item>
            <img alt="Imagen 3" src="https://picsum.photos/100/50" />
            <ion-checkbox label-placement="end">Sala de lactancia</ion-checkbox>
        </ion-item>
        <ion-item>
            <img alt="Imagen 3" src="https://picsum.photos/100/50" />
            <ion-checkbox label-placement="end">De pago</ion-checkbox>
        </ion-item>
    </ion-list>
</template>

<script lang="ts">
import { IonCheckbox } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonCheckbox },
});
</script>

<style scoped>

img{
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 10px;
}

</style>