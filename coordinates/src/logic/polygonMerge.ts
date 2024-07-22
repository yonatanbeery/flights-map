import { calculatePolygonArea } from './polygonSize';
import { maxOverlapPercentage } from '../utils/globals';

type Point = { lat: number; lng: number; alt: number };

// Helper function to find the intersection of two polygons using the Sutherland-Hodgman algorithm
function clipPolygon(subjectPolygon: Point[], clipPolygon: Point[]): Point[] {
  const isInside = (point: Point, edgeStart: Point, edgeEnd: Point): boolean => {
    return (edgeEnd.lat - edgeStart.lat) * (point.lng - edgeStart.lng) > (edgeEnd.lng - edgeStart.lng) * (point.lat - edgeStart.lat);
  };

  const computeIntersection = (edgeStart: Point, edgeEnd: Point, startPoint: Point, endPoint: Point): Point => {
    const edgeVector = { lat: edgeStart.lat - edgeEnd.lat, lng: edgeStart.lng - edgeEnd.lng };
    const segmentVector = { lat: startPoint.lat - endPoint.lat, lng: startPoint.lng - endPoint.lng };
    const edgeCross = edgeStart.lat * edgeEnd.lng - edgeStart.lng * edgeEnd.lat;
    const segmentCross = startPoint.lat * endPoint.lng - startPoint.lng * endPoint.lat;
    const determinant = 1.0 / (edgeVector.lat * segmentVector.lng - edgeVector.lng * segmentVector.lat);
    return {
      lat: parseFloat(
        (
          (edgeCross * segmentVector.lat - segmentCross * edgeVector.lat) *
          determinant
        ).toFixed(2)
      ),
      lng: parseFloat(
        (
          (edgeCross * segmentVector.lng - segmentCross * edgeVector.lng) *
          determinant
        ).toFixed(2)
      ),
      alt: startPoint.alt
    };
  };

  let outputPolygon: Point[] = subjectPolygon;
  for (let i = 0; i < clipPolygon.length; i++) {
    const edgeStart = clipPolygon[i];
    const edgeEnd = clipPolygon[(i + 1) % clipPolygon.length];
    const inputPolygon: Point[] = outputPolygon;
    outputPolygon = [];

    let startPoint: Point = inputPolygon[inputPolygon.length - 1];
    for (let j = 0; j < inputPolygon.length; j++) {
      const endPoint = inputPolygon[j];
      if (isInside(endPoint, edgeStart, edgeEnd)) {
        if (!isInside(startPoint, edgeStart, edgeEnd)) {
          outputPolygon.push(computeIntersection(edgeStart, edgeEnd, startPoint, endPoint));
        }
        outputPolygon.push(endPoint);
      } else if (isInside(startPoint, edgeStart, edgeEnd)) {
        outputPolygon.push(computeIntersection(edgeStart, edgeEnd, startPoint, endPoint));
      }
      startPoint = endPoint;
    }
  }
  return outputPolygon;
}

// Helper function to calculate the overlap percentage
const calculateOverlapPercentage = (
  polygon1: Point[],
  polygon2: Point[]
): number => {
  const intersection = clipPolygon(polygon1, polygon2);
  const area1 = calculatePolygonArea(polygon1);
  const area2 = calculatePolygonArea(polygon2);
  const intersectionArea = calculatePolygonArea(intersection);

  const overlapPercentage1 = intersectionArea / area1;
  const overlapPercentage2 = intersectionArea / area2;

  return Math.max(overlapPercentage1, overlapPercentage2);
};

// Function to merge two polygons and update their height
const mergePolygons = (polygon1: Point[], polygon2: Point[]): Point[] => {
  const combinedPoints = [...polygon1, ...polygon2];
  const mergedHull = convexHull(combinedPoints);
  const maxHeight = Math.max(...combinedPoints.map((point) => point.alt));

  return mergedHull.map((point) => ({ ...point, alt: maxHeight }));
};

// Function to calculate the convex hull of a set of points
const convexHull = (points: Point[]): Point[] => {
  const sortedPoints = [...points].sort(
    (a, b) => a.lat - b.lat || a.lng - b.lng
  );

  const crossProduct = (O: Point, A: Point, B: Point): number => {
    return (
      (A.lat - O.lat) * (B.lng - O.lng) - (A.lng - O.lng) * (B.lat - O.lat)
    );
  };

  const lowerHull: Point[] = [];
  for (const point of sortedPoints) {
    while (
      lowerHull.length >= 2 &&
      crossProduct(
        lowerHull[lowerHull.length - 2],
        lowerHull[lowerHull.length - 1],
        point
      ) <= 0
    ) {
      lowerHull.pop();
    }
    lowerHull.push(point);
  }

  const upperHull: Point[] = [];
  for (let i = sortedPoints.length - 1; i >= 0; i--) {
    const point = sortedPoints[i];
    while (
      upperHull.length >= 2 &&
      crossProduct(
        upperHull[upperHull.length - 2],
        upperHull[upperHull.length - 1],
        point
      ) <= 0
    ) {
      upperHull.pop();
    }
    upperHull.push(point);
  }

  upperHull.pop();
  lowerHull.pop();

  return lowerHull.concat(upperHull);
};

// Main function to process the list of polygons and merge overlapping ones
export const processPolygons = (polygons: Point[][]): Point[][] => {
  let mergedPolygons: Point[][] = [];

  while (polygons.length) {
    let polygon = polygons.pop()!;
    let merged = false;

    for (let i = 0; i < polygons.length; i++) {
      const overlapPercentage = calculateOverlapPercentage(
        polygon,
        polygons[i]
      );
      if (overlapPercentage >= maxOverlapPercentage) {
        polygon = mergePolygons(polygon, polygons[i]);
        polygons.splice(i, 1);
        merged = true;
        break;
      }
    }

    if (merged) {
      polygons.push(polygon);
    } else {
      mergedPolygons.push(polygon);
    }
  }

  return mergedPolygons;
};
