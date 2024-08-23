import {readCoordinatesFromFile} from './coordinates/coordinateFormatter';
import { Point } from './utils/types';
import {getMaxHeight} from './logic/radiusAbovePoint';
import {getBorderPoints} from './logic/findGroups';
import { divideToPolygons } from './logic/polygonDivision';
import {sortBorderPoints} from "./logic/findGroups"
import * as fs from "fs";

const run = async () => {
  const heights:Point[][] = await readCoordinatesFromFile();
  console.log("calculating max hights");
  const maxs = getMaxHeight(heights);
  printMaxHeightInAllPoints(maxs)
  console.log("dividing to polygons");
  const polygons = divideToPolygons(maxs);
  console.log("thinning polygons");
  const thinnedPolygons = polygons.map(polygon => getBorderPoints(polygon)).filter((polygon) => polygon.length > 2);
  console.log("polygons");
  const sortedPolygons = []

  thinnedPolygons.sort((a, b) => a[0].alt < b[0].alt ? 1 : 0)
  Object.keys(thinnedPolygons).forEach(polygon => {
    sortedPolygons.push(sortBorderPoints(thinnedPolygons[polygon]));
  })
  fs.writeFileSync("../polygonsCoordinates.json",JSON.stringify(sortedPolygons))
  
}

const printMaxHeightInAllPoints = (maxs: Point[][]) => {
  const maxsJson:Record<string, Record<string, {lat: number, lng:number, alt:number}>> = {}
  Object.keys(maxs).forEach((lat) => {
    if (!maxsJson[lat]) maxsJson[lat] = {}
    Object.keys(maxs[lat]).forEach((long) => {
      maxsJson[lat][long] = {lat: Number.parseFloat(lat), lng: Number.parseFloat(long), alt: maxs[lat][long].alt}
    })
  })
  fs.writeFileSync("../maxHeights.json",JSON.stringify(maxsJson))
}

run()