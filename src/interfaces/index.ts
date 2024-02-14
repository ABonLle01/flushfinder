import { TToastStatus } from "@/store/useToasterStore";

interface Filters {
    handicapped: boolean,
    changingstation: boolean,
    free: boolean
}

interface Coordinates{
    latitude:number;
    longitude:number;
}

interface FormData {
    name: string;
    image: File | null;
    score: string;
    latitude: number;
    longitude: number;
    handicapped: boolean;
    changingstation: boolean;
    free: boolean;
  }

  interface MapInstance {
    getMarkerById(id: any): any;
    getLayer(name: string): any;
}

interface IToast {
    text: string;
    status: TToastStatus;
    id: number;
    cssClass: string;
  }


export type{
    Filters, Coordinates, MapInstance,IToast, FormData
}


