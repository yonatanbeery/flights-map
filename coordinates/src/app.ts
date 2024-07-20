import {readCoordinatesFromFile} from './coordinates/coordinateFormatter';
import { Point } from './utils/types';
import {getMaxHeight} from './logic/radiusAbovePoint';
import {getBorderPoints} from './logic/findGroups';
import { divideToPolygons } from './logic/polygonDivision';

const run = async () => {
  const heights:Point[][] = await readCoordinatesFromFile();
  console.log("calculating max hights");
  const maxs = getMaxHeight(heights);
  console.log("dividing to polygons");
  const polygons = divideToPolygons(maxs);
  console.log("thinning polygons");
  const thinnedPolygons = polygons.map(polygon => getBorderPoints(polygon))
  console.log("polygons");
  thinnedPolygons.forEach((point) => console.log(point))
}

run()
