export type Point = {
    lat: number;
    long: number;
    alt?: number;
}

export type getAltitudeResponsePoint = {
    latitude: number;
    longitude: number;
    elevation: number;
}

export type getAltitudeResponse = {
  results: getAltitudeResponsePoint[]
}

export type PolygonPoint = {
  lat: number,
  lng: number, 
  alt: number
}