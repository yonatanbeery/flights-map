import { getAltitudes } from "./api";
import { Point, getAltitudeResponsePoint } from "./types"
import * as fs from "fs";

const areaLimits: Point[] = [
  {
    lat: 33.090000,
    long: 35.080000
  },
  {
    lat: 34.730000,
    long: 36.660000
  }
]

const pointAccuracy = 0.01

//This function only to be used once. to pull all the hights of the coordinates in a specific area
export const getAllPointsAltitudes = async () => {
  const allCoordinates:getAltitudeResponsePoint[][] = []
  for(let lat = 0; lat < (areaLimits[1].lat - areaLimits[0].lat) / pointAccuracy; lat++) {
    const queriedCoordinates = [];
    for(let long = 0; long < (areaLimits[1].long - areaLimits[0].long) / pointAccuracy; long++) {
      queriedCoordinates.push({lat: areaLimits[0].lat + lat * pointAccuracy, long: areaLimits[0].long + long * pointAccuracy})
    }
    
    const results = (await getAltitudes(queriedCoordinates)).results
    allCoordinates.push(results);
    console.log(results);
    
  }
  
  fs.writeFile("coordinates.json", JSON.stringify(allCoordinates), (error) => {
    if (error) {
      console.error(error);
      throw error;
    }
    console.log("coordinates.json written correctly");
  });
}