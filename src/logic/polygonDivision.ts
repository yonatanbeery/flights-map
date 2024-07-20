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

const findPolygon = (points: Point[][], currPoint: Point) => {
    if (points[currPoint.lat - pointAccuracy][currPoint.long]) {

    }


}

export const divideToPolygons = (points: Point[][]): Point[][] => {
    initArrays(points);

    Object.keys(points).sort().forEach((lat) => {
        Object.keys(points[lat]).sort().forEach((long) => {
            if (!visited[lat][long]) {
                polygons[currrPolygonIndex] = [];
                findPolygon(points[lat][long]);
                currrPolygonIndex++;
            }
        })
    });

    return polygons;
}