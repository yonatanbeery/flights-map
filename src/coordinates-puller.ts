import { all } from "axios";
import { getAltitudes } from "./api";
import { Point, getAltitudeResponsePoint } from "./types"
import * as fs from "fs";

export const areaLimits = {
  min: {
    lat: 33.090000,
    long: 35.080000
  },
  max:{
    lat: 34.730000,
    long: 36.660000
  }
}

const pointAccuracy = 0.01

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