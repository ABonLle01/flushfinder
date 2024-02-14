import { defineStore } from "pinia";
import { IToast } from "@/interfaces";

// Status will define toast color and icon
export type TToastStatus = "success" | "warning" | "error";

type ToastPayload = { timeout?: number; text: string };

const defaultTimeout = 3000;

const createToast = (text: string, status: TToastStatus): IToast => ({
    text,
    status,
    id: Math.random() * 1000,
    // Agregar una propiedad de clase CSS basada en el estado del toast
    cssClass: `toast-${status}`,
});

export default defineStore("toaster-store", {
    state: (): { toasts: IToast[] } => ({
        toasts: [],
    }),
    actions: {
        updateState(payload: ToastPayload, status: TToastStatus) {
            // Get text and timeout from payload
            const { text, timeout } = payload;
            // We create the toast with function above
            const toast = createToast(text, status);
            // We push toasts to the state
            this.toasts.push(toast);
            // We create a delay to delete toast after its provided timeout is over
            setTimeout(() => {
                this.toasts = this.toasts.filter((t) => t.id !== toast.id);
            }, timeout ?? defaultTimeout);
        },
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