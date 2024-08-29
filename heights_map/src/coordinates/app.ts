import {readCoordinatesFromFile} from './coordinates/coordinateFormatter';
import { Point } from './utils/types';
import {getMaxHeight} from './logic/radiusAbovePoint';
import {getBorderPoints} from './logic/findGroups';
import { divideToPolygons } from './logic/polygonDivision';
import {sortBorderPoints} from "./logic/findGroups"
import { MapPoint } from '../utils/types';

export const getPolygons = (warningRadius: number):MapPoint[][] => {
  const heights:Point[][] = readCoordinatesFromFile();
  console.log("calculating max hights");
  const maxs = getMaxHeight(heights, warningRadius);
  console.log("dividing to polygons");
  const polygons = divideToPolygons(maxs);
  console.log("thinning polygons");
  const thinnedPolygons:Point[][] = polygons.map(polygon => getBorderPoints(polygon)).filter((polygon) => polygon.length > 2);
  console.log("polygons");
  const sortedPolygons:MapPoint[][] = [];

  thinnedPolygons.sort((a, b) => a[0].alt && b[0].alt ? a[0].alt < b[0].alt ? 1 : 0 : 0)
  Object.keys(thinnedPolygons).forEach((polygonIndex: string) => {
    sortedPolygons.push(sortBorderPoints(thinnedPolygons[+polygonIndex]));
  })
  return sortedPolygons;
}