import { Point } from "../utils/types";
import { pointAccuracy } from "../utils/globals";

let polygons:Point[][] = [];
let visited:boolean[][] = [];
let currrPolygonIndex = 0;

const initArrays = (points: Point[][]) => {
    polygons = [];
    visited = [];
    
    Object.keys(points).forEach((lat) => {
        visited[lat] = [];
        Object.keys(points[lat]).forEach((long) => {
          visited[lat][long] = false;
        })
      })
}

const isCoordinatesInPolygon = (points: Point[][], lat: number, long: number, height: number): boolean => {
    return points[lat]?.[long] && !visited[lat][long] && points[lat][long].alt == height
}

const findPolygon = (points: Point[][], currPoint: Point) => {
    if (isCoordinatesInPolygon(points, currPoint.lat - pointAccuracy, currPoint.long, currPoint.alt)) {
        findPolygon(points, points[currPoint.lat - pointAccuracy][currPoint.long]);
    }
    
    if (isCoordinatesInPolygon(points, currPoint.lat + pointAccuracy, currPoint.long, currPoint.alt)) {
        findPolygon(points, points[currPoint.lat + pointAccuracy][currPoint.long]);
    }

    if (isCoordinatesInPolygon(points, currPoint.lat, currPoint.long - pointAccuracy, currPoint.alt)) {
        findPolygon(points, points[currPoint.lat - pointAccuracy][currPoint.long - pointAccuracy]);
    }

    if (isCoordinatesInPolygon(points, currPoint.lat, currPoint.long + pointAccuracy, currPoint.alt)) {
        findPolygon(points, points[currPoint.lat - pointAccuracy][currPoint.long + pointAccuracy]);
    }
}

export const divideToPolygons = (points: Point[][]): Point[][] => {
    initArrays(points);

    Object.keys(points).sort().forEach((lat) => {
        Object.keys(points[lat]).sort().forEach((long) => {
            if (!visited[lat][long]) {
                polygons[currrPolygonIndex] = [];
                findPolygon(points, points[lat][long]);
                currrPolygonIndex++;
            }
        })
    });

    return polygons;
}