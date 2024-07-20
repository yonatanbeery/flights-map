import { Point } from "../utils/types";
import { pointAccuracy } from "../utils/globals";

let polygons:Point[][][] = [];
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
    if (!polygons[currrPolygonIndex][currPoint.lat]) {
        polygons[currrPolygonIndex][currPoint.lat] = [];
    }
    polygons[currrPolygonIndex][currPoint.lat][currPoint.long] = points[currPoint.lat][currPoint.long];   
    visited[currPoint.lat][currPoint.long] = true;

    if (isCoordinatesInPolygon(points, parseFloat((currPoint.lat - pointAccuracy).toFixed(2)), currPoint.long, currPoint.alt)) {
        findPolygon(points, points[parseFloat((currPoint.lat - pointAccuracy).toFixed(2))][currPoint.long]);
    }
    
    if (isCoordinatesInPolygon(points, parseFloat((currPoint.lat + pointAccuracy).toFixed(2)), currPoint.long, currPoint.alt)) {
        findPolygon(points, points[parseFloat((currPoint.lat + pointAccuracy).toFixed(2))][currPoint.long]);
    }

    if (isCoordinatesInPolygon(points, currPoint.lat, parseFloat((currPoint.long - pointAccuracy).toFixed(2)), currPoint.alt)) {
        findPolygon(points, points[currPoint.lat][parseFloat((currPoint.long - pointAccuracy).toFixed(2))]);
    }

    if (isCoordinatesInPolygon(points, currPoint.lat, parseFloat((currPoint.long + pointAccuracy).toFixed(2)), currPoint.alt)) {
        findPolygon(points, points[currPoint.lat][parseFloat((currPoint.long + pointAccuracy).toFixed(2))]);
    }
}

export const divideToPolygons = (points: Point[][]): Point[][][] => {
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