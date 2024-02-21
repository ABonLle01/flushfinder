<!-- Teleport is a component that lets us render our toasts outside of #app div. This is important because, like modals, we want everything created over our app as a different DOM node -->
<template>
  <Teleport to="body">
    <ul v-if="toastStore.toasts.length" class="toaster__wrapper">
      <li v-for="toast in toastStore.toasts" :class="['toaster__inner', toast.cssClass]" :key="toast.text">
        <IonIcon :name="toastIconMap[toast.status]" class="toaster__inner-icon"/>
        <span class="toaster__inner-text">{{ toast.text }}</span>
      </li>
    </ul>
  </Teleport>
</template>

<script setup lang="ts">
import useToasterStore, { TToastStatus } from "@/store/useToasterStore";
import { IonIcon } from "@ionic/vue";

// Asigna un ícono específico a cada estado de notificación
const toastIconMap: Record<TToastStatus, string> = {
  error: "toast-error",     // Notificaciones de error
  warning: "toast-warning", // Notificaciones de advertencia
  success: "toast-success", // Notificaciones de éxito
};

const toastStore = useToasterStore();
</script>

<style scoped>
.toaster__wrapper {
  position: fixed;
  bottom: 20%;
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.toaster__inner {
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 50px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
}

.toaster__inner-text {
  flex: 1;
  font-weight: bold;
}

/* Estilos para cada estado de toast */
.toast-success {
  background-color: green;
  color: white;
}

.toast-warning {
  background-color: yellow;
}

.toast-error {
  background-color: red;
  color: white;
}

@media screen and (min-width: 1100px) {

.toaster__inner {
  width: 25%;
}


.toaster__inner-icon {
  margin-right: 10px;
}

.toaster__inner-text {
  flex: 1;
  font-size: x-large;
}

}

</style>

  