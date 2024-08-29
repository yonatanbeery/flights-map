import { getAltitudes } from "../utils/api";
import { getAltitudeResponsePoint } from "../utils/types"
import * as fs from "fs";
import { areaLimits, pointAccuracy } from "../utils/globals";

//This function only to be used once. to pull all the hights of the coordinates in a specific area
export const getAllPointsAltitudes = async () => {
  const allCoordinates:getAltitudeResponsePoint[][] = []
  for(let lat = 0; lat < (areaLimits['max'].lat - areaLimits['min'].lat) / pointAccuracy; lat++) {
    const queriedCoordinates = [];
    for(let long = 0; long < (areaLimits['max'].long - areaLimits['min'].long) / pointAccuracy; long++) {
      queriedCoordinates.push({lat: areaLimits['min'].lat + lat * pointAccuracy, long: areaLimits['min'].long + long * pointAccuracy})
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