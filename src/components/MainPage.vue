<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <div class="container">
        <p>No hay conexion a Internet</p>
        
        <div class="map">
          <MapViewer v-if="currentLocation" :latitude="currentLocation.latitude" :longitude="currentLocation.longitude" />
        </div>
 
        <div class="list" v-if="showList">
          <FlushList v-if="currentLocation" :flushList="flushList" :initialLocation="currentLocation" @setLocation="setLocation" />
        </div>

        <div class="form" v-cloak v-show="!showList">
          <router-view class="form"></router-view>
        </div>
        
      </div>
    </ion-content>
  </ion-page>
</template>

 
<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import FlushList from '@/components/FlushList.vue';
import MapViewer from '@/components/MapViewer.vue';
import { getFlushList } from '@/services';
import { onMounted, ref, watch } from 'vue';
import { useRouter, RouteLocationNormalizedLoaded } from 'vue-router';
import { useStore } from 'vuex';
import { getCurrentLocation } from '@/store';
import { useLocationStore, useFilterStore } from '@/store/piniaStore';
import { Preferences } from '@capacitor/preferences';

const filtersStore = useFilterStore(); // Uso de useFilterStore para obtener el estado de los filtros
const store = useStore(); // Uso de useStore para obtener el estado global de la aplicación
const showList = ref(store.state.showList); // Referencia reactiva para mostrar la lista de elementos
const router = useRouter(); // Uso de useRouter para obtener el router actual
const flushList = ref([]); // Referencia reactiva para la lista de objetos flushList
const currentLocation = ref(); // Referencia reactiva para la ubicación actual
const currentLocationStore = useLocationStore(); // Uso de useLocationStore para obtener el estado de la ubicación actual
 
// Función para aplicar los filtros y obtener la lista actualizada
const applyFilters = (filtros) => {
  getFlushList(filtros.handicapped, filtros.changingstation, filtros.free,currentLocation.value.latitude, currentLocation.value.longitude)
  .then((updatedList) => {
    flushList.value = updatedList;
    store.state.flushcounter=flushList.value.length;
    console.log("Store state: "+ store.state.flushcounter + " (MainPage)")
  })
  .catch((error) => {
    console.error('Error applying filters:', error);
  });
};

// Observa los cambios en los filtros y aplica los filtros cuando cambian
watch(() => filtersStore.filters, () => {
    applyFilters(filtersStore.filters)
  }, { deep: true }// Establece la opción deep como true para observar cambios profundos en los filtros
)

// Función que se ejecuta cuando el componente se monta en el DOM
onMounted(async () => {
  try {
    // Obtiene la última ubicación del usuario
    let { value }: any = await Preferences.get({ key: 'userLastLocation' });
    value = JSON.parse(value);

    // Establece la ubicación actual con la última ubicación conocida o con valores predeterminados
    currentLocation.value = {
        latitude: value ? value.latitude : 36,
        longitude: value ? value.longitude : -4
    };

    // Obtiene la lista inicial de objetos flushList
    const initialList = await getFlushList(false, false, false, currentLocation.value.latitude, currentLocation.value.longitude);

    // Actualiza la lista de objetos flushList con la lista inicial
    flushList.value = initialList;
    
    // Actualiza el estado de la ubicación actual en la tienda de ubicaciones
    currentLocationStore.setCurrentLocation(currentLocation.value);
    // Obtiene la ubicación actual del dispositivo
    getCurrentLocation();

  } catch (error) {
    // Manejo de errores en caso de falla al obtener la ubicación
      console.error(error);
  }
});
 
// Función que se ejecuta cuando el componente se monta en el DOM
onMounted(() => {
  // Observa los cambios en el estado de la lista para mostrarla y actualizar la ruta
  store.watch(() => store.state.showList, (value) => {
    // Actualiza el valor de mostrar lista
    showList.value = value;
    
    actualizarRuta();
  });
});
 
// Función para actualizar la ruta según el estado de mostrar lista
const actualizarRuta = () => {
  //La variable currentRoute se declara con un tipo que puede ser RouteLocationNormalizedLoaded (si la ruta está cargada) o undefined (si la ruta no está definida o cargada). 
  //Esto se hace para manejar el caso en el que la ruta actual puede no estar disponible en un momento dado. 
  const currentRoute: RouteLocationNormalizedLoaded | undefined = router.currentRoute.value;
 
  if (currentRoute) {
    const folderId = currentRoute.params.id ? `/${currentRoute.params.id}` : '/';
    const newPath = showList.value ? folderId : '/';
    router.push({ path: newPath });
  }
};
 
// Función para establecer la ubicación actual
const setLocation = ({ latitude, longitude }) => {
  console.log({ latitude, longitude })
  currentLocation.value = { latitude, longitude };
}
 
</script>
 
 
 
 
<style scoped>

p{
  position:absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
  width: 60%;
  height: 25%;
  font-size: x-large;
  font-weight: bolder;
}

.map {
  height: 40vh;
  position: sticky;
  top: 0;
  z-index: 9;
}

.list {
  height: 100%;
  overflow-y: auto;
  position: sticky;
}
 
.container {
  position: relative;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
}
 
 
@media screen and (min-width: 1100px) {
 
  .container {
    display: -webkit-box;
    flex-direction: row;
    height: 100%;
  }
 
  .map {
    width: 50vw;
    height: 100%;
    position: sticky;
  }
 
  .list {
    width: 50vw;
  }
 
  .form {
    position: sticky
  }
 
  p{
    height: 95%;
    font-size: xx-large;
  }

}
 
 
</style>
 