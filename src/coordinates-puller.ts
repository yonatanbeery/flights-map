type Point = {
  lat: number;
  long: number;
  alt?: number;
}

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

export const getAllPointsAltitudes = () => {
  let counter = 0;
  for(let lat = areaLimits[0].lat; lat < areaLimits[1].lat; lat += 0.01) {
    for(let long = areaLimits[0].long; long < areaLimits[1].long; long += 0.01) {
      console.log({lat, long});
      counter ++
    }
  }
  console.log({counter})
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