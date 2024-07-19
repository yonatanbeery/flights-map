export type Point = {
    lat: number;
    long: number;
    elevation?: number;
}

export type getAltitudeResponse = {
  results: Point[];
}