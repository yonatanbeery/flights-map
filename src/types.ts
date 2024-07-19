export type Point = {
    lat: number;
    long: number;
    alt?: number;
}

type getAltitudeResponsePoint = {
    lat: number;
    long: number;
    elevation: number;
}

export type getAltitudeResponse = {
  results: getAltitudeResponsePoint[]
}