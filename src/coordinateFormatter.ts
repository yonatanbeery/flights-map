import { getAltitudeResponsePoint, Point } from "./types"
import * as fs from "fs";

export const readCoordinatesFromFile = async ():Promise<Point[][]> => {
  let fileContent:getAltitudeResponsePoint[][];
  const data = fs.readFileSync('coordinates.json',
    { encoding: 'utf8', flag: 'r' });
  fileContent = JSON.parse(data)
    
  const heights:Point[][] = []

  fileContent.forEach((coords: getAltitudeResponsePoint[]) => {
    coords.forEach((coord) => {
      if(!heights[coord.latitude]) heights[coord.latitude] = []
      heights[coord.latitude][coord.longitude] = {lat: coord.latitude, long: coord.longitude, alt: coord.elevation}
    })
  });
  return heights;
}