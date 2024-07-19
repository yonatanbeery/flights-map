import { getAltitudes } from "./api";
import { Point, getAltitudeResponsePoint } from "./types"
import * as fs from "fs";

export const readCoordinatesFromFile = async () => {
  let fileContent:getAltitudeResponsePoint[][];
  const data = fs.readFileSync('coordinates.json',
    { encoding: 'utf8', flag: 'r' });
  fileContent = JSON.parse(data)
    
  const heights:number[][] = []

  fileContent.forEach((coords: getAltitudeResponsePoint[]) => {
    coords.forEach((coord) => {
      if(!heights[coord.latitude]) heights[coord.latitude] = []
      heights[coord.latitude][coord.longitude] = coord.elevation
    })
  });
  return heights;
}