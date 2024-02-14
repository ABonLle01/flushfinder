<template>
  <div id="map-container">
    <!-- Contenido del mapa aquí -->
  </div>

  <form @submit.prevent="submitForm" id="register-form" :class="{ 'register': true, 'form': true }">

    <div class="relleno">
      <img src="/favicon.png" alt="logo">
      <div class="text">
        <h1>AÑADE UN NUEVO FLUSH</h1>
        <p>Colabora con la comunidad</p>
      </div>      
    </div>

    <ion-item class="nombre">
      <label for="name" class="lbl">Nombre</label>
      <ion-input v-model="formData.name" placeholder="Ej: CESUR Málaga Este" color="dark" required></ion-input>
    </ion-item>

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

      <button class="btn" id="add" type="submit">Añadir</button>
      <button class="btn" id="cancel" type="button" @click="toggleShowList();">Cancelar</button>

    </div>

    <p v-if="errors.length">
      <p v-for="error in errors" :key="error">{{ error }}</p>
    </p>

  </form>
</template>



<script setup lang="ts">
// Importación de módulos y componentes necesarios
import { IonItem, IonToggle, IonInput } from '@ionic/vue'; // Importa componentes de Ionic
import { ref } from 'vue'; // Importa funciones necesarias de Vue
import { useStore } from 'vuex'; // Importa la función useStore de Vuex para acceder al store
import L from 'leaflet'; // Importa Leaflet para trabajar con mapas interactivos
import { FormData } from '../interfaces'; // Importa la interfaz FormData
import { locationService } from '@/services/DataService';

// Declaración de variables reactivas y funciones
const map = ref<L.Map | null>(null); // Referencia al mapa Leaflet
const errors = ref<string[]>([]); // Array reativo para almacenar errores de validación del formulario
const store = useStore(); // Acceso al store Vuex

const formData = ref<FormData>({ // Objeto reativo para almacenar los datos del formulario
  name: '',
  image: 'https://picsum.photos/100/100',
  score: '',
  latitude: 0,
  longitude: 0,
  handicapped: false,
  changingstation: false,
  free: false,
});

// Función para manejar el cambio de estado de los toggles del formulario
const handleToggleChange = (toggleName: keyof FormData | string) => {
  formData.value[toggleName] = !formData.value[toggleName];
};

// Función para alternar la visualización de la lista de baños
const toggleShowList = () => {
  store.dispatch('toggleShowList');
};


// Función para manejar el evento de selección de puntuación
const rating = (event: Event) => {
  const selectedRating = (event.target as HTMLInputElement).value;
  formData.value.score = selectedRating;
  console.log("Puntuación seleccionada:", selectedRating);
};


// Función para enviar el formulario
const submitForm = async() => {
  errors.value = [];
  
  // Validación del formulario
  if (!formData.value.name) {
    errors.value.push('El nombre es obligatorio.');
  }

  if(!formData.value.score){
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
  if (errors.value.length === 0) {  
    try {
      // Envía los datos del formulario a la API
      const response = await fetch('https://api.flushfinder.es/flush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData.value)
      });

      // Si la petición fue exitosa, muestra un mensaje de éxito en la consola
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

/*   height: 50vh; */

  margin-top: 18%;

}

.relleno{
  display: none;
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

}


.wrapper{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  grid-auto-rows: minmax(fit-content, auto);

  margin-top: 2rem;

  align-items: center;
  
}

.rating{
  position: relative;
  right: 3dvw;
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