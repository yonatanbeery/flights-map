import {readCoordinatesFromFile} from './coordinateFormatter';
import { Point } from './types';

const latDiff = 1.112 / 0.01; //km
const longDiff = 0.9317 / 0.01; //km

const isPointInRadius = (center: Point, point: Point, redius: number) => {
 return (((center.lat - point.lat) * latDiff) ** 2 + ((center.long - point.long) * longDiff) ** 2) < redius**2;
}

const getMaxHeightInRadius = (heights: Point[][], point: Point, radius: number) => {
  let maxHeight: Point | undefined = undefined;
  Object.keys(heights).forEach((lat) => {
    Object.keys(heights[lat]).forEach((long) => {
      if (isPointInRadius(point, heights[lat][long], radius)) {
        if (!maxHeight || heights[lat][long].alt > maxHeight) {
          maxHeight = heights[lat][long];
        }
      }
    });
  });

  return maxHeight;
}

const run = async () => {
  const heights = await readCoordinatesFromFile();

  const radius = 10;
  const maxHeights: Point[][] = [];

  Object.keys(heights).forEach((lat) => {
    maxHeights[lat] = [];
    Object.keys(heights[lat]).forEach((long) => {
      maxHeights[lat][long] = getMaxHeightInRadius(heights, heights[lat][long], radius);
    });
  })

  console.log(maxHeights);
}

run()
