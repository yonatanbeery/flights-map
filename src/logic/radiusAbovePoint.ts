import { Point } from "../utils/types";
import { warningRadius, areaLimits, layersHeightDiff } from "../utils/globals";

export const getMaxHeight = (heights: Point[][]):Point[][] => {
  const maxHeights: Point[][] = [];
  Object.keys(heights).forEach((lat) => {
    Object.keys(heights[lat]).forEach((long) => {
      if (!maxHeights[lat]) maxHeights[lat] = []
      const maxPoint = getMaxHeightInRadius(heights[lat][long], heights)
      maxHeights[lat][long] = {lat: Number.parseFloat(lat), long: Number.parseFloat(long), alt: maxPoint.alt + layersHeightDiff - (maxPoint.alt % layersHeightDiff)}
    })
  })
  return maxHeights;
}

const getMaxHeightInRadius = (point: Point, heights: Point[][]):Point => {
  let maxPoint:Point = point;
  const latDiff = Number.parseFloat((warningRadius * KMtoLat).toFixed(2))  
  const longDiff = Number.parseFloat((warningRadius * KMtoLong).toFixed(2));

  for(let lat = Number.parseFloat((point.lat - latDiff).toFixed(2)) ; lat < Number.parseFloat((point.lat + latDiff).toFixed(2)); lat = Number.parseFloat((lat + 0.01).toFixed(2))) {
    for(let long = Number.parseFloat((point.long - longDiff).toFixed(2)); long < Number.parseFloat((point.long + longDiff).toFixed(2)); long = Number.parseFloat((long + 0.01).toFixed(2))) {      
      if(getVectorDistance(getLatDistance(lat, point.lat), getLongDistance(long, point.long)) < warningRadius && 
    lat >= areaLimits.min.lat && lat <= areaLimits.max.lat && long >= areaLimits.min.long && long <= areaLimits.max.long && maxPoint.alt < heights[lat][long].alt
    ) {
        maxPoint = heights[lat][long]
      }
    }
  }
  return maxPoint
}

const getVectorDistance = (v1, v2) => {
  return Math.sqrt( v1*v1 + v2*v2 );
}

//1.112KM = 0.01deg
const latToKMeter = 111.2
const KMtoLat = 1 / 111.2

//0.9317KM = 0.01deg
const longToKMeter = 93.17
const KMtoLong = 1 / 93.17

const getLatDistance = (p1:number, p2:number) => {
return Math.abs(p1 - p2) * latToKMeter
}

const getLongDistance = (p1:number, p2:number) => {
return Math.abs(p1 - p2) * longToKMeter
}
