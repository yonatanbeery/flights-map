import {readCoordinatesFromFile} from './coordinates/coordinateFormatter';
import { Point } from './utils/types';
import {getMaxHeight} from './logic/radiusAbovePoint';
import {getBorderPoints} from './logic/findGroups';
import { divideToPolygons } from './logic/polygonDivision';

const limitPolygons = (poligons: Point[][]): Point[][] => {
  return poligons.filter((polygon) => polygon.length > 2);
}

const run = async () => {
  const heights:Point[][] = await readCoordinatesFromFile();
  console.log("calculating max hights");
  const maxs = getMaxHeight(heights);
  console.log("dividing to polygons");
  const polygons = divideToPolygons(maxs);
  console.log("thinning polygons");
  // const thinnedPolygons = polygons.map(polygon => getBorderPoints(polygon));
  const thinnedPolygons = limitPolygons(polygons.map(polygon => getBorderPoints(polygon)));
  console.log("polygons");
  Object.keys(thinnedPolygons).forEach(polygon => {
    console.log({coord: thinnedPolygons[polygon]});
  });
  console.log(`divided to ${thinnedPolygons.length} polygons`);
}

run()