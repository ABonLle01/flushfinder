<template>
  <div>
    <form @submit.prevent="submitForm">
      
          <ion-item>
            <ion-label for="" position="fixed">Nombre</ion-label>
            <ion-input v-model="formData.name" placeholder="Ej: CESUR Málaga Este" color="dark" required></ion-input>
          </ion-item>

        <div class="wrapper">

          
          <label for="status">Estado del baño</label>
          <div class="rating">
            <input value="5" name="rate" id="star5" type="radio" @click="rating">
            <label title="text" for="star5"></label>
            <input value="4" name="rate" id="star4" type="radio" @click="rating">
            <label title="text" for="star4"></label>
            <input value="3" name="rate" id="star3" type="radio" @click="rating">
            <label title="text" for="star3"></label>
            <input value="2" name="rate" id="star2" type="radio" @click="rating">
            <label title="text" for="star2"></label>
            <input value="1" name="rate" id="star1" type="radio" @click="rating">
            <label title="text" for="star1"></label>
          </div>
          
          <ion-label for="handicapped" class="lbl">Discapacitados</ion-label>
          <ion-toggle id="handicapped" value="handicapped" class="tgl" @ionChange="handleToggleChange('handicapped')" label-placement="start" :checked="formData.filtros.includes('handicapped')"></ion-toggle>
          
          <ion-label for="babychanger" class="lbl">Sala de lactancia</ion-label>
          <ion-toggle id="babychanger" value="babychanger" class="tgl" @ionChange="handleToggleChange('babychanger')" label-placement="start" :checked="formData.filtros.includes('babychanger')"></ion-toggle>
          
          <ion-label for="free" class="lbl">Acceso gratuito</ion-label>
          <ion-toggle id="free" value="free" class="tgl" @ionChange="handleToggleChange('free')" label-placement="start" :checked="formData.filtros.includes('free')"></ion-toggle>
          
          <button class="btn" id="add" type="submit" @click="addFlush()">Añadir</button>
          <button class="btn" id="cancel" type="button" @click="cancel()">Cancelar</button>
        </div>

        <p v-if="errors.length">
          <!-- <b>Por favor, corrija el(los) siguiente(s) error(es):</b> -->
          <p v-for="error in errors" :key="error">{{ error }}</p>
          <!-- <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul> -->
        </p>

      <!-- <span class="test">Checked filters: {{ formData.filtros }}</span> -->

    </form>
  </div>
</template>
 
<script setup lang="ts">
import { IonItem, IonToggle, IonInput, IonLabel  } from '@ionic/vue';
import { ref } from 'vue';
import { useStore } from 'vuex';

interface FormData {
  name: string;
  filtros: string[];
  rating: string;
}

const formData = ref<FormData>({
  name: '',
  filtros: [],
  rating: '' 
});


const handleToggleChange = async (value: string) => {
  const index = formData.value.filtros.indexOf(value);
 
  if (index === -1) {
    formData.value.filtros.push(value);
  } else {
    formData.value.filtros.splice(index, 1);
  }

};

const store = useStore();

const toggleShowList = () => {
  store.dispatch('toggleShowList');
};

const addFlush = () => {
  console.log("Flush added");
};

const cancel = () => {
  console.log("cancel");
  toggleShowList();
};

const rating = (event: Event) => {
  const selectedRating = (event.target as HTMLInputElement).value;
  formData.value.rating = selectedRating;
  console.log("Puntuación seleccionada:", selectedRating);
}
const errors = ref<string[]>([]);
 
const submitForm = () => {
  errors.value = [];
  /* hacer que no se puedan meter nombres que sean espacios en blanco */
  if (!formData.value.name) {
    errors.value.push('El nombre es obligatorio.');
  }
  if(!formData.value.rating){
    errors.value.push('Selecciona una puntuacion.')
  }
  if(!formData.value.rating){
    errors.value.push('Selecciona una puntuacion.')
  }
 
  if (errors.value.length === 0) {  
    console.log(formData.value.filtros);
 
    console.log('Formulario válido, datos:',  JSON.stringify(formData.value));
  }
};
</script>
 
<style scoped>


form {
  --background-color: rgba(140, 0, 255, 0.205);
  height: 48.5vh;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;

  position: sticky;
}

.wrapper{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  grid-auto-rows: minmax(fit-content, auto);

  margin-top: 2rem;
/*   justify-content: center;  */
  align-items: center;
  
}

.lbl{
  text-align: left;
  margin-left: 0.5rem;

  font-size: large;
}

.tgl{
  position: relative;
  left: 15dvw;
}

.rating{
  position: relative;
  right: 3dvw;
}

.wrapper>label{
  font-size: large;
}
 
 
 
.wrapper>label{
  font-size: large;
}
 
 
.test{
  position: relative;
  top: 50px;
}


.btn {
 position: relative;
 font-size: 16px;
 text-transform: uppercase;
 text-decoration: none;
 padding: 1em 1em;
 display: inline-block;
 border-radius: 6em;
 transition: all .2s;
 border: none;
 font-family: inherit;
 background-color: #EA358C;
 color: white;
 font-weight: bold;
}


.btn:active {
 transform: translateY(-1px);
 box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}
.btn::after {
 content: "";
 display: inline-block;
 height: 100%;
 width: 100%;
 border-radius: 100px;
 position: absolute;
 top: 0;
 left: 0;
 z-index: -1;
 transition: all .4s;
}

/* .btn::after {
 background-color: #fff;
} */

/* .btn:hover::after {
 transform: scaleX(1.4) scaleY(1.6);
 opacity: 0;
} */


.rating{
  margin-bottom: 6px;
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
  color: #EA358C;
}
 
.rating:not(:checked) > label:hover,
.rating:not(:checked) > label:hover ~ label {
  color: #EA358C;
}
 
.rating > input:checked ~ label {
  color: #EA358C;
}
 
 
 
 
 
</style>