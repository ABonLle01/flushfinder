import { defineStore } from "pinia";
import { IToast } from "@/interfaces";

export type TToastStatus = "success" | "warning" | "error"; // Definición de los posibles estados de los toasts

type ToastPayload = { timeout?: number; text: string }; // Definición del tipo de carga útil para los toasts

const defaultTimeout = 3000; // Tiempo de espera predeterminado para los toasts

// Función para crear un objeto de toast con el texto y el estado proporcionados
const createToast = (text: string, status: TToastStatus): IToast => ({
    text,
    status,
    id: Math.random() * 1000,
    // Agregar una propiedad de clase CSS basada en el estado del toast
    cssClass: `toast-${status}`,
});

// Definición del almacenamiento Vuex para manejar los toasts
export default defineStore("toaster-store", {
    state: (): { toasts: IToast[] } => ({
        toasts: [], // Inicialmente no hay toasts
    }),
    actions: {
        // Acción para actualizar el estado del almacenamiento con un nuevo toast
        updateState(payload: ToastPayload, status: TToastStatus) {
            // Obtener el texto y el tiempo de espera del payload
            const { text, timeout } = payload;
            // Creamos el toast utilizando la función anterior
            const toast = createToast(text, status);
            // Agregamos el toast al estado de los toasts
            this.toasts.push(toast);
            // Creamos un retraso para eliminar el toast después de que su tiempo de espera proporcionado haya terminado
            setTimeout(() => {
                this.toasts = this.toasts.filter((t) => t.id !== toast.id);
            }, timeout ?? defaultTimeout); // Si no se proporciona un tiempo de espera se utiliza el tiempo de espera predeterminado
        },
        // Acciones para mostrar diferentes tipos de toast
        success(payload: ToastPayload) {
            this.updateState(payload, "success");
        },

        warning(payload: ToastPayload) {
            this.updateState(payload, "warning");
        },

        error(payload: ToastPayload) {
            this.updateState(payload, "error");
        },
    },
});