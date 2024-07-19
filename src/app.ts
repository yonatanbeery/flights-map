//import {getAllPointsAltitudes} from './coordinates-puller';
import {readCoordinatesFromFile} from './coordinateFormatter';
import { Point } from './types';
import {getMaxHeight} from './radiusAbovePoint';

const run = async () => {
  const heights:Point[][] = await readCoordinatesFromFile()
  
  const maxs = getMaxHeight(heights);

  Object.keys(maxs).forEach((lat) => {
    Object.keys(maxs[lat]).forEach((long) => {
      console.log(maxs[lat][long]);
      
    })
  })
}

run()
