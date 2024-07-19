import {readCoordinatesFromFile} from './coordinateFormatter';
import { Point } from './types';

const pointDiff = 0.01;
const latCorrection = 1.112;
const longCorrection = 0.9317;


const isPointInRadius = (center: Point, point: Point, redius: number) => {
 return (((center.lat - point.lat) * latCorrection / pointDiff) ** 2 + ((center.long - point.long) * longCorrection / pointDiff) ** 2) < redius ** 2;
}

const getMaxHeightInRadius = (heights: Point[][], point: Point, radius: number) => {
  let maxHeight: Point | undefined = undefined;
  
  for (let lat = parseFloat((point.lat - radius / latCorrection * pointDiff).toFixed(2)); lat <= point.lat + radius / latCorrection * pointDiff ; lat = parseFloat((lat + pointDiff).toFixed(2))) {
    for (let long = parseFloat((point.long - radius / longCorrection * pointDiff).toFixed(2)); long <= point.long + radius / longCorrection * pointDiff; long = parseFloat((long + pointDiff).toFixed(2))) {           
      if (heights[lat] && heights[lat][long]) {
        if (isPointInRadius(point, heights[lat][long], radius) && (!maxHeight || heights[lat][long].alt > maxHeight.alt)) {
          maxHeight = heights[lat][long];
        }
      }
    }
  }

  return maxHeight;
}

export const getMaxHeights = async () => {
  const heights = await readCoordinatesFromFile();

  const radius = 10;
  const maxHeights: Point[][] = [];

  Object.keys(heights).forEach((lat) => {
    maxHeights[lat] = [];
    Object.keys(heights[lat]).forEach((long) => {
      maxHeights[lat][long] = getMaxHeightInRadius(heights, heights[lat][long], radius);
    });
  })

  return maxHeights;
}
