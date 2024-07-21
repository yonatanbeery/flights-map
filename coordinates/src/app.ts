import { readCoordinatesFromFile } from './coordinates/coordinateFormatter';
import { Point, PolygonPoint } from './utils/types';
import { getMaxHeight } from './logic/radiusAbovePoint';
import { getBorderPoints } from './logic/findGroups';
import { divideToPolygons } from './logic/polygonDivision';
import { sortPolygons } from './logic/polygon-order';

const run = async () => {
  console.log('reading points');
  const heights: Point[][] = await readCoordinatesFromFile();
  console.log('getting max heights');
  const maxs = getMaxHeight(heights);
  console.log('dividing to polygons');
  const polygons = divideToPolygons(maxs);
  const thinnedPolygons = polygons
    .map((polygon) => getBorderPoints(polygon))
    .filter((polygon) => polygon.length > 2);
  const sortedPolygons: PolygonPoint[][] = sortPolygons(thinnedPolygons).map(
    (polygon) =>
      polygon.map((point) => {
        return { lat: point.lat, lng: point.long, alt: point.alt };
      })
  );
  console.log('[');
  Object.keys(sortedPolygons).forEach((polygon) => {
    console.log(`${JSON.stringify(sortedPolygons[polygon])},`);
  });
  console.log(']');
  console.log(`found ${sortedPolygons.length} poplygons`);
};

run();
