import {readCoordinatesFromFile} from './coordinates/coordinateFormatter';
import { Point } from './utils/types';
import {getMaxHeight} from './logic/radiusAbovePoint';
import { areaLimits } from './utils/globals';
import {getBorderPoints} from './logic/findGroups';
import { divideToPolygons } from './logic/polygonDivision';
import { json } from 'express';

const printPoints = (points) => {
  for(let lat = Number.parseFloat((areaLimits.min.lat).toFixed(2)); lat < Number.parseFloat((areaLimits.max.lat).toFixed(2)); lat = Number.parseFloat((lat + 0.01).toFixed(2))) {
    for(let long = Number.parseFloat((areaLimits.min.long).toFixed(2)); long < Number.parseFloat((areaLimits.max.long).toFixed(2)); long = Number.parseFloat((long + 0.01).toFixed(2))) {
      console.log(points[lat][long]);
    }
  }
}

const run = async () => {
  // const heights:Point[][] = await readCoordinatesFromFile();
  // printPoints(heights);
  // const maxs = getMaxHeight(heights);
  // const inBorderPoints = getBorderPoints(maxs);
  // inBorderPoints.forEach((point) => console.log(point))

  const points:Point[][] = {
    '0.01': {'0.01': {lat: 0.01, long: 0.01, alt: 1}, '0.02': {lat: 0.01, long: 0.02, alt: 1}, '0.03':  {lat: 0.01, long: 0.03, alt: 1}, '0.04': {lat: 0.01, long: 0.04, alt: 3}, '0.05': {lat: 0.01, long: 0.05, alt: 3}},
    '0.02': {'0.01': {lat: 0.02, long: 0.01, alt: 1}, '0.02': {lat: 0.02, long: 0.02, alt: 1}, '0.03':  {lat: 0.02, long: 0.03, alt: 1}, '0.04': {lat: 0.02, long: 0.04, alt: 3}, '0.05': {lat: 0.02, long: 0.05, alt: 2}},
    '0.03': {'0.01': {lat: 0.03, long: 0.01, alt: 1}, '0.02': {lat: 0.03, long: 0.02, alt: 2}, '0.03':  {lat: 0.03, long: 0.03, alt: 2}, '0.04': {lat: 0.03, long: 0.04, alt: 3}, '0.05': {lat: 0.03, long: 0.05, alt: 3}},
    '0.04': {'0.01': {lat: 0.04, long: 0.01, alt: 2}, '0.02': {lat: 0.04, long: 0.02, alt: 1}, '0.03':  {lat: 0.04, long: 0.03, alt: 2}, '0.04': {lat: 0.04, long: 0.04, alt: 1}, '0.05': {lat: 0.04, long: 0.05, alt: 1}},
    '0.05': {'0.01': {lat: 0.05, long: 0.01, alt: 1}, '0.02': {lat: 0.05, long: 0.02, alt: 3}, '0.03':  {lat: 0.05, long: 0.03, alt: 2}, '0.04': {lat: 0.05, long: 0.04, alt: 1}, '0.05': {lat: 0.05, long: 0.05, alt: 1}}
  } as any

  const polygons = divideToPolygons(points);
  polygons.forEach((polygon, index) => {
    console.log(`#${index}`);
    Object.keys(polygon).forEach((lat) => {
      Object.keys(polygon[lat]).forEach((long) => {
        console.log(JSON.stringify(polygon[lat][long]));
      })
    })
    console.log("\n");
  })
}

run()
