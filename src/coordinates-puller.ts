import { Point } from "./types"

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

export const getAllPointsAltitudes = () => {
  let counter = 0;
  const allCoordinates:Point[][] = []
  for(let lat = 0; lat < (areaLimits[1].lat - areaLimits[0].lat) / pointAccuracy; lat++) {
    allCoordinates[lat] = []
    for(let long = 0; long < (areaLimits[1].long - areaLimits[0].long) / pointAccuracy; long++) {
      allCoordinates[lat][long] = {lat: areaLimits[0].lat + lat * pointAccuracy, long: areaLimits[0].long + long * pointAccuracy, alt: 123}
      console.log(allCoordinates[lat][long]);
      counter ++
    }
  }
  console.log({counter})
  JSON.stringify(allCoordinates)
}

const LatDiffToKM = (lat1, lat2) => {
  return Math.abs(lat1 - lat2) * (180 / 1.64)
}

const LongDiffToKM = (long1, long2) => {
  return Math.abs(long1 - long2) * (140 / 1.58)
}

//33.09 | 34.73 = 1.64 = 180

//35.08 - 36.66 = 1.58 = 140

/*

{
    lat: 33.090000,
    long: 36.660000
  },
  {
    lat: 34.730000,
    long: 35.080000
  }
    */