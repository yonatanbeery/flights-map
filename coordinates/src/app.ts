import { readCoordinatesFromFile } from './coordinates/coordinateFormatter';
import { Point } from './utils/types';
import { getMaxHeight } from './logic/radiusAbovePoint';
import { getBorderPoints } from './logic/findGroups';
import { divideToPolygons } from './logic/polygonDivision';
import { sortBorderPoints } from './logic/findGroups';
import { calculatePolygonArea } from './logic/polygonSize';
import * as fs from 'fs';

const run = async () => {
  const heights: Point[][] = await readCoordinatesFromFile();
  console.log('calculating max hights');
  const maxs = getMaxHeight(heights);
  console.log('dividing to polygons');
  const polygons = divideToPolygons(maxs);
  console.log('thinning polygons');
  const thinnedPolygons = polygons.map((polygon) => getBorderPoints(polygon));
  console.log('polygons');
  const sortedPolygons = [];

  thinnedPolygons.sort((a, b) => (a[0].alt < b[0].alt ? 1 : 0));
  Object.keys(thinnedPolygons).forEach((polygon) => {
    sortedPolygons.push(sortBorderPoints(thinnedPolygons[polygon]));
  });
  const filteredPolygons = sortedPolygons.filter(
    (polygon) => calculatePolygonArea(polygon) > 0.015
  );
  console.log(`${filteredPolygons.length} after filter`);

  fs.writeFileSync(
    '../polygonsCoordinates.json',
    JSON.stringify(filteredPolygons)
  );
};

run();
