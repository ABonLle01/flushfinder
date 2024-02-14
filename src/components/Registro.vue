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

        <input type="hidden" name="latitude" v-model="formData.latitude"> <!-- Campo oculto para almacenar la latitud del marcador -->
        <input type="hidden" name="longitude" v-model="formData.longitude"> <!-- Campo oculto para almacenar la longitud del marcador -->
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
      <ion-toggle id="handicapped" value="handicapped"  label-placement="start" @click="handleToggleChange('handicapped')"></ion-toggle>

      <label for="changingstation">Sala de lactancia</label>
      <ion-toggle id="changingstation" value="changingstation"  label-placement="start" @click="handleToggleChange('changingstation')"></ion-toggle>

        <label for="free">Acceso gratuito</label>
        <ion-toggle id="free" value="free"  label-placement="start" @click="handleToggleChange('free')"></ion-toggle>
        <Toaster/>
        <button class="btn" id="add" type="submit">Añadir</button>
        <button class="btn" id="cancel" type="button" @click="toggleShowList()">Cancelar</button>

      </div>


    </form>
  </div>
</template>

<script setup lang="ts">

import { IonItem, IonToggle, IonInput  } from '@ionic/vue';
import { ref } from 'vue';
import { useStore } from 'vuex'; 
import L from 'leaflet';
import { FormData as datos } from '../interfaces'; 
import { locationService } from '@/services/DataService';
import badWords from 'bad-words';

import Toaster from "./Toaster.vue";
import useToasterStore from "../store/useToasterStore";

const toasterStore = useToasterStore();

/* const successToast = () => toasterStore.success({ text: "Yahoooooo!" }); */

const errorToast = (errorMessage: string) => {
  toasterStore.error({ text: errorMessage });
};

// Declaración de variables reactivas y funciones
const map = ref<L.Map | null>(null); // Referencia al mapa Leaflet
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
      const response = await fetch('http://localhost:3000/flush', {
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

    // Oculta la lista de baños
    toggleShowList();
  }

};


</script>


<style scoped>
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
  /* justify-content: center; */
}


@media screen and (min-width: 1100px) {
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
    width: 100%;
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


.wrapper{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  grid-auto-rows: minmax(fit-content, auto);

  margin-top: 1.5rem;

  align-items: center;
  
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
  right: 3dvw;
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