import {readCoordinatesFromFile} from './coordinates/coordinateFormatter';
import { Point } from './utils/types';
import {getMaxHeight} from './logic/radiusAbovePoint';
import { areaLimits } from './utils/globals';
import {findHeightGroups} from './logic/findGroups';

const printPoints = (points) => {
  for(let lat = Number.parseFloat((areaLimits.min.lat).toFixed(2)); lat < Number.parseFloat((areaLimits.max.lat).toFixed(2)); lat = Number.parseFloat((lat + 0.01).toFixed(2))) {
    for(let long = Number.parseFloat((areaLimits.min.long).toFixed(2)); long < Number.parseFloat((areaLimits.max.long).toFixed(2)); long = Number.parseFloat((long + 0.01).toFixed(2))) {
      console.log(points[lat][long]);
    }
  }
}

const run = async () => {
  const heights:Point[][] = await readCoordinatesFromFile()
  const maxs = getMaxHeight(heights);
  printPoints(maxs)
  //const groups = findHeightGroups(maxs);
}

run()
