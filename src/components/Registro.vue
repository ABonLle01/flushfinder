<template>
  <div class="register">
    <form enctype="multipart/form-data" @submit.prevent="submitForm" id="register-form" :class="{ 'register': true, 'form': true }">

      <div class="relleno">
        <img src="/favicon.png" alt="logo">
        <div class="text">
          <h1>AÑADE UN NUEVO FLUSH</h1>
          <p>Colabora con la comunidad</p>
        </div>      
      </div>

      <div class="contenedor">
        <ion-item class="nombre">
          <label for="name" class="lbl">Nombre</label>
          <ion-input v-model="formData.name" placeholder="Ej: CESUR Málaga Este" color="dark" required></ion-input>
        </ion-item>

        <ion-item class="image">
          <label for="image" class="lbl">Imagen</label>
          <input type="file" id="image" name="image" accept="image/*" @change="handleImageChange" required>
        </ion-item>
      </div>
      
      <!-- Campos ocultos para almacenar la latitud y latitud del marcador -->
      <input type="hidden" name="latitude" v-model="formData.latitude"> 
      <input type="hidden" name="longitude" v-model="formData.longitude">
    
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
        
        <label for="handicapped">Discapacitados</label>
        <div class="sContainer">
          <input class="switch" type="checkbox"  id="handicapped" value="handicapped" v-model="formData.handicapped" label-placement="start" @click="handleToggleChange('handicapped')">
        </div>

        <label for="changingstation">Sala de lactancia</label>
        <div class="sContainer">
          <input class="switch" type="checkbox" id="changingstation" value="changingstation" v-model="formData.changingstation" label-placement="start" @click="handleToggleChange('changingstation')">
        </div>        

        <label for="free">Acceso gratuito</label>
        <div class="sContainer">
          <input class="switch" type="checkbox" id="free" value="free" v-model="formData.free" label-placement="start" @click="handleToggleChange('free')">
        </div>

        <Toaster/>

        <button class="btn" id="add" type="submit">Añadir</button>
        <button class="btn" id="cancel" type="button" @click="cancel()">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">

import { IonItem, IonInput  } from '@ionic/vue';
import { ref } from 'vue';
import { useStore } from 'vuex'; 
import { FormData as datos } from '../interfaces'; 
import { locationService } from '@/services/DataService';
import badWords from 'bad-words';

import Toaster from "./Toaster.vue";
import useToasterStore from "../store/useToasterStore";

const toasterStore = useToasterStore();

const errorToast = (errorMessage: string) => {
  toasterStore.error({ text: errorMessage });
};

const successToast = (successMessage: string) => {
  toasterStore.success({ text: successMessage });
};

// Declaración de variables reactivas y funciones
const errors = ref<string[]>([]); // Array reativo para almacenar errores de validación del formulario
const store = useStore(); // Acceso al store Vuex

const formData = ref<datos>({
  name: '',
  image: null,
  score: '',
  latitude: 0,
  longitude: 0,
  handicapped: false,
  changingstation: false,
  free: false
});
 
//Imagen
const handleImageChange = (event) => {
  const fileInput = event.target;
  const file = fileInput.files[0];
  if (file) {
    console.log("Imagen seleccionada:", file);
    formData.value.image = file;
  }
};

const handleToggleChange = (toggleName: keyof FormData | string) => {
  formData.value[toggleName] = !formData.value[toggleName];
};
 
const toggleShowList = () => {
  store.dispatch('toggleShowList');
};

const rating = (event: Event) => {
  const selectedRating = (event.target as HTMLInputElement).value;
  formData.value.score = selectedRating;
  console.log("Puntuación seleccionada:", selectedRating);
};

function filterBadWords(name: string): string {
  const filter = new badWords();
  return filter.clean(name);
}
 
function validateBathroomName(name: string): boolean {
  // Expresión regular que coincide con cadenas que contienen solo letras, números, espacios y ciertos caracteres especiales comunes,
  // y no permite varios caracteres especiales seguidos
  const regex = /^[A-Za-záéíóúüÜñÑ]+(?: [A-Za-záéíóúüÜñÑ]+)*$/;

  // La función test() de la expresión regular devuelve true si la cadena contiene solo letras, 
  // y false si contiene algún otro tipo de caracter

  if (!regex.test(name)) {
    if (name.trim() === '') {
      errorToast('El nombre no puede estar vacio.');
      errors.value.push('El nombre no puede estar vacío.');
    } else {
      errorToast('El nombre debe contener solo letras y un único espacio.');
      errors.value.push('El nombre debe contener solo letras y un único espacio.');
    }
    return false; // Retorna false para indicar que la validación ha fallado
  }

  return regex.test(name);
}

const cancel = () => {
  formData.value.name="";
  formData.value.image= null;
  formData.value.score= '',
  formData.value.latitude= 0,
  formData.value.longitude= 0;
  formData.value.handicapped = false;
  formData.value.changingstation = false;
  formData.value.free = false;

  toggleShowList();
}

const submitForm = async() => {
  errors.value = [];

  const validatedName = validateBathroomName(formData.value.name);

  if(validatedName){
    if (filterBadWords(formData.value.name).includes("*")) {
      errorToast('El nombre no puede contener palabras malsonantes.');
      errors.value.push('El nombre no puede contener palabras malsonantes.');
    } else formData.value.name=formData.value.name.toUpperCase();
  }
 
  if(!formData.value.score){
    errorToast('Selecciona una puntuacion.');
    errors.value.push('Selecciona una puntuacion.')
  }

  const savedLatitude = locationService.state.latitude.value
  const savedLongitude = locationService.state.longitude.value

  // Comprobar si las coordenadas se guardaron correctamente
  if (savedLatitude!=null && savedLongitude!=null) {
    // Asignar las coordenadas al formulario
    formData.value.latitude = savedLatitude;
    formData.value.longitude = savedLongitude;

  } else {
    // Si las coordenadas son 0,0, muestra un error y no envía el formulario
    errorToast('Seleccione la ubicación del baño.')
    errors.value.push('Por favor, haz clic en el mapa para seleccionar la ubicación del baño.');
    return;
  }

  // Si no hay errores en el formulario
  if(!formData.value.image || formData.value.image==null){
    errorToast('Selecciona una imagen.');
    errors.value.push('Selecciona una imagen.');
  }

  // Verifica si no hay errores en el formulario
  if (errors.value.length === 0) {  

    try {
      // Obtiene la última ubicación del usuario
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.value.name);
      formDataToSend.append('score', formData.value.score);
      formDataToSend.append('latitude', formData.value.latitude.toString());
      formDataToSend.append('longitude', formData.value.longitude.toString());
      formDataToSend.append('handicapped', formData.value.handicapped.toString());
      formDataToSend.append('changingstation', formData.value.changingstation.toString());
      formDataToSend.append('free', formData.value.free.toString());
      
      if (formData.value.image instanceof File) {
        formDataToSend.append('image', formData.value.image);
        console.log("imagen cargada: ",formData.value.image)
      }

      // Realiza una solicitud POST a la API para enviar los datos del formulario con la imagen
      const response = await fetch('https://api.flushfinder.es/flush', {
        method: 'POST',
        body: formDataToSend
      });
      console.log("FormdataToSend: "+formDataToSend);

      // Verifica si la respuesta de la solicitud fue exitosa
      if (response.ok) {
        console.log('¡Datos del formulario enviados con éxito!');
      } else {
        console.error('Error al enviar los datos del formulario:', response.statusText);
      }

    } catch (error) {
      console.error('Error al obtener los datos de ubicación guardados o al enviar el formulario:', error);
    }

    console.log(formData.value);
    console.log('Formulario válido, datos:',  JSON.stringify(formData.value));

    locationService.state.latitude.value=null;
    locationService.state.longitude.value=null;

    toggleShowList();

    successToast("Baño insertado correctamente")
    successToast("Recargue la app para ver el contenido!")
  }
};

</script>


<style scoped>
.sContainer{
  width: 100%;
  justify-content: center;
}

.switch {
  position: relative;
  height: 1rem;
  width: 2rem;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  border-radius: 9999px;
  background-color: rgba(100, 116, 139, 0.377);
  transition: all .3s ease;
}

.switch:checked {
  background-color: rgba(236, 72, 153, 1);
}

.switch::before {
  position: absolute;
  content: "";
  left: calc(0.9rem - 1rem);
  top: calc(0.9rem - 1rem);
  display: block;
  height: 1rem;
  width: 1rem;
  cursor: pointer;
  border: 1px solid rgba(100, 116, 139, 0.527);
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 3px 10px rgba(100, 116, 139, 0.327);
  transition: all .3s ease;
}

.switch:hover::before {
  box-shadow: 0 0 0px 8px rgba(0, 0, 0, .15)
}

.switch:checked:hover::before {
  box-shadow: 0 0 0px 8px rgba(236, 72, 153, .15)
}

.switch:checked:before {
  transform: translateX(100%);
  border-color: rgba(236, 72, 153, 1);
}

form {
  --background-color: rgba(140, 0, 255, 0.205);
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;
  margin-top: 10%;
}

.relleno{
  display: none;
}

.contenedor{
  display: flex;
  flex-direction: column;
}

.wrapper{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  grid-auto-rows: minmax(fit-content, auto);

  margin-top: 1.5rem;
  justify-content: left;
  align-items: center;
}

.wrapper>label{
  display: flex;
  justify-content: left;
  padding-bottom: 6px;
}

.toggle{
  display: flex;
  justify-content: left;
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

.rating{
  position: relative;
  margin-bottom: 6px;

  display: ruby;
  justify-content: center;
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


@media screen and (min-width: 1100px) {

  .rating:not(:checked) > label {
    font-size: 40px;
  }

  .switch{
    height: 2rem;
    width: 4rem;
  }

  .switch::before{
    left: calc(1rem - 1.1rem);
    top: calc(1rem - 1.1rem);
    height: 2rem;
    width: 2rem;
  }

  .register{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50vw;

    height: fit-content;
  }

  label,.nombre{
    font-size: xx-large;
  }


  .wrapper{
    gap: 30px;
    margin-top: 2rem;
  }

  .lbl{
    width: 100%;
  }

  .relleno h1{
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: bolder;
  }

  .relleno{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    
    margin-bottom: 70px;
    width: 80%;
    gap: 40px;
  
    color: white;
    background-color: #EA358C;
    border-radius: 25px;
  }

  .relleno img{
    width: 200px;
    height: 200px;
  }

  form{
    margin-left: 30px;
  }

  .text{
    display: flex;
    flex-direction: column;
    margin: 20px;
  }

  .text p{
    font-weight: bolder;
  }
 
}

@media screen and (max-width: 697px){

  .contenedor{
    max-width: 325px;
  }

}


</style>