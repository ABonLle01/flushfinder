<template>
  <div>
    <form @submit.prevent="submitForm">
      <p v-if="errors.length">
        <b>Por favor, corrija el(los) siguiente(s) error(es):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </p>

      <!-- <ion-item>
        <ion-input v-model="formData.name" placeholder="Nombre del baño" color="dark"></ion-input>
      </ion-item>
      <div class="data">
        <label for="status">Estado del baño</label>

        <div class="rating">
          <input value="5" name="rate" id="star5" type="radio">
          <label title="text" for="star5"></label>
          <input value="4" name="rate" id="star4" type="radio">
          <label title="text" for="star4"></label>
          <input value="3" name="rate" id="star3" type="radio" checked="false">
          <label title="text" for="star3"></label>
          <input value="2" name="rate" id="star2" type="radio">
          <label title="text" for="star2"></label>
          <input value="1" name="rate" id="star1" type="radio">
          <label title="text" for="star1"></label>
        </div>


      </div>

      <ion-toggle id="handicaped" value="handicaped" @ionChange="handleToggleChange('handicaped')" label-placement="start" :checked="formData.filtros.includes('handicaped')">Discapacitados</ion-toggle><br>
      <ion-toggle id="lactancia" value="lactancia" @ionChange="handleToggleChange('lactancia')" label-placement="start" :checked="formData.filtros.includes('lactancia')">Sala de lactancia</ion-toggle><br>
      <ion-toggle id="dePago" value="dePago" @ionChange="handleToggleChange('dePago')" label-placement="start" :checked="formData.filtros.includes('dePago')">Acceso gratuito</ion-toggle>

      <div class="data">
        <button type="submit" id="add" value="addFlush">Añadir</button>
        <button type="button" id="cancel" value="cancel">Cancelar</button>
      </div>

      <span>Checked names: {{ formData.filtros }}</span> -->
      <ion-row>
        <!-- First Column -->
        <ion-col>
          <ion-item>
            <ion-input v-model="formData.name" placeholder="Nombre del baño" color="dark"></ion-input>
          </ion-item>

          <div class="data">
            <label for="status">Estado del baño</label>

            <!-- ... (existing code for rating) -->

          </div>
        </ion-col>

        <!-- Second Column -->
        <ion-col>
          <ion-toggle id="handicaped" value="handicaped" @ionChange="handleToggleChange('handicaped')" label-placement="start" :checked="formData.filtros.includes('handicaped')">Discapacitados</ion-toggle><br>
          <ion-toggle id="lactancia" value="lactancia" @ionChange="handleToggleChange('lactancia')" label-placement="start" :checked="formData.filtros.includes('lactancia')">Sala de lactancia</ion-toggle><br>
          <ion-toggle id="dePago" value="dePago" @ionChange="handleToggleChange('dePago')" label-placement="start" :checked="formData.filtros.includes('dePago')">Acceso gratuito</ion-toggle>

          <div class="data">
            <button type="submit" id="add" value="addFlush">Añadir</button>
            <button type="button" id="cancel" value="cancel">Cancelar</button>
          </div>

          <span>Checked names: {{ formData.filtros }}</span>
        </ion-col>
      </ion-row>


    </form>
  </div>
</template>

<script setup lang="ts">
import { IonItem, IonToggle, IonInput } from '@ionic/vue';
import { ref, nextTick } from 'vue';

const formData = ref({
  name: '',
  filtros: []
});

const handleToggleChange = async (value: string) => {
  const index = formData.value.filtros.indexOf(value);

  if (index === -1) {
    formData.value.filtros.push(value);
  } else {
    formData.value.filtros.splice(index, 1);
  }

  /* try {
    // Enviar solicitud POST al servidor
    //la ruta que sale por defecto es esta: http://localhost:5173
    const response = await fetch('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value),
    });

    if (response.ok) {
      // La solicitud fue exitosa
      nextTick(() => {
        console.log('Actualizado en nextTick:', JSON.stringify(formData.value));
      });
    } else {
      // La solicitud no fue exitosa, manejar el error según sea necesario
      console.error('Error al enviar la solicitud POST. Código de estado:', response.status);
    }
  } catch (error) {
    console.error('Error al enviar la solicitud POST:', error);
    // Manejar el error según sea necesario
  } */
};

const errors = ref<string[]>([]);

const submitForm = () => {
  errors.value = [];
  /* hacer que no se puedan meter nombres que sean espacios en blanco */
  if (!formData.value.name) {
    errors.value.push('Todos los campos son obligatorios.');
  }

  if (errors.value.length === 0) {  
    console.log(formData.value.filtros);

    console.log('Formulario válido, datos:',  JSON.stringify(formData.value));
  }
};
</script>

<style scoped>

form {
  background-color: rgba(140, 0, 255, 0.205);
  height: 48.5vh;
  align-items: center;
  justify-content: center;

  margin-top: 20px;
}

.data{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  gap: 18vw;
}

.rating{
  padding-bottom: 6px;
}

.rating:not(:checked) > input {
  position: absolute;
  appearance: none;
}

.rating:not(:checked) > label {
  float: right;
  cursor: pointer;
  font-size: 30px;
  color: #666;
}

.rating:not(:checked) > label:before {
  content: '★';
}

.rating > input:checked + label:hover,
.rating > input:checked + label:hover ~ label,
.rating > input:checked ~ label:hover,
.rating > input:checked ~ label:hover ~ label,
.rating > label:hover ~ input:checked ~ label {
  color: #e58e09;
}

.rating:not(:checked) > label:hover,
.rating:not(:checked) > label:hover ~ label {
  color: #ff9e0b;
}

.rating > input:checked ~ label {
  color: #ffa723;
}





</style>
