import { meterToFeet } from "../utils/globals";
import { getAltitudeResponsePoint, Point } from "../utils/types"
import * as fs from "fs";

const convertMeterToFeet = (meter: number): number => {
  return Math.round(meter * meterToFeet);
}

export const readCoordinatesFromFile = async ():Promise<Point[][]> => {
  let fileContent:getAltitudeResponsePoint[][];
  const data = fs.readFileSync('coordinates.json',
    { encoding: 'utf8', flag: 'r' });
  fileContent = JSON.parse(data)
    
  const heights:Point[][] = []

  fileContent.forEach((coords: getAltitudeResponsePoint[]) => {
    coords.forEach((coord) => {
      if(!heights[coord.latitude]) heights[coord.latitude] = []
      heights[coord.latitude][coord.longitude] = {lat: coord.latitude, long: coord.longitude, alt: convertMeterToFeet(coord.elevation)}
    })
  });

  return heights;
}