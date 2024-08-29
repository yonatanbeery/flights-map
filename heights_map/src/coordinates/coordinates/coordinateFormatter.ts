import { layersHeightDiff, meterToFeet } from "../utils/globals";
import { getAltitudeResponsePoint, Point } from "../utils/types"
import rawPolygons from '../../../coordinates.json';

const convertMeterToFeet = (meter: number): number => {
  return Math.round(meter * meterToFeet);
}

export const readCoordinatesFromFile = ():Point[][] => {
  let fileContent:getAltitudeResponsePoint[][];
  console.log(JSON.stringify(rawPolygons));
  
  fileContent = JSON.parse(JSON.stringify(rawPolygons))
  
  const heights:Point[][] = [];

  fileContent.forEach((coords: getAltitudeResponsePoint[]) => {
    coords.forEach((coord) => {
      if(!heights[coord.latitude]) heights[coord.latitude] = []
      heights[coord.latitude][coord.longitude] = {lat: coord.latitude, long: coord.longitude, alt: convertMeterToFeet(coord.elevation) + layersHeightDiff - (convertMeterToFeet(coord.elevation) % layersHeightDiff)}
    })
  });

  return heights;
}