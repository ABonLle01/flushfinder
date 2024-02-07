<template>
  <div class="register">
    <form @submit.prevent="submitForm">

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

        <button class="btn" id="add" type="submit" @click="addFlush()">Añadir</button>
        <button class="btn" id="cancel" type="button" @click="cancel()">Cancelar</button>

      </div>

      <p v-if="errors.length">
        <p v-for="error in errors" :key="error">{{ error }}</p>
      </p>

    </form>
  </div>
</template>
 

<script setup lang="ts">

import { Preferences } from '@capacitor/preferences';
import { IonItem, IonToggle, IonInput  } from '@ionic/vue';
import { ref } from 'vue';
import { useStore } from 'vuex';

import { FormData } from '../interfaces'

const errors = ref<string[]>([]);

const store = useStore();

const formData = ref<FormData>({
  name: '',
  image: 'https://picsum.photos/100/100',
  score: '',
  latitude: 1,
  longitude: 1,
  handicapped: false,
  changingstation: false,
  free: false 
});


const handleToggleChange = (toggleName: keyof FormData | string) => {
  formData.value[toggleName] = !formData.value[toggleName];
};

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
  formData.value.score = selectedRating;
  console.log("Puntuación seleccionada:", selectedRating);
}

 
const submitForm = async() => {
  errors.value = [];
  /* hacer que no se puedan meter nombres que sean espacios en blanco */
  if (!formData.value.name) {
    errors.value.push('El nombre es obligatorio.');
  }

  if(!formData.value.score){
    errors.value.push('Selecciona una puntuacion.')
  }

  if (errors.value.length === 0) {  

  try {
    const { value } = await Preferences.get({ key: 'userLastLocation' });

    if (value) {
      const locationData = JSON.parse(value);
      formData.value.latitude = locationData.latitude;
      formData.value.longitude = locationData.longitude;
    } else {
      console.warn('No se encontraron datos de ubicación guardados.');
    }

    const response = await fetch('https://api.flushfinder.es/flush', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
    });

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

  .text{
    display: flex;
    flex-direction: column;
    margin: 20px;
  }

  .text p{
    font-weight: bolder;
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