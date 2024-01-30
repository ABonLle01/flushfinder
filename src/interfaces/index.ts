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
    image: string;
    score: string;
    latitude: number;
    longitude: number;
    handicapped: boolean;
    changingstation: boolean;
    free: boolean;
  }

export type {
    Filters, Coordinates, FormData
}


