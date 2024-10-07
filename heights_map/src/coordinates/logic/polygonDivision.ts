import { Point } from "../utils/types";
import { pointAccuracy } from "../utils/globals";

let polygons: Point[][][] = [];
let visited: boolean[][] = [];
let currrPolygonIndex = 0;

const initArrays = (points: Point[][]) => {
    polygons = [];
    visited = [];
    
    Object.keys(points).forEach((lat) => {
        visited[lat as any as number] = [];
        Object.keys(points[lat as any as number]).forEach((long) => {
            visited[lat as any as number][long as any as number] = false;
        })
    })
}

const isCoordinatesInPolygon = (points: Point[][], lat: number, long: number, height: number): boolean => {
    return points[lat]?.[long] && !visited[lat][long] && points[lat][long].alt === height;
}

const findPolygonNonRecursive = (points: Point[][], start: Point) => {
    const stack = [start];

    while (stack.length > 0) {
        const currPoint = stack.pop();
        if (!currPoint) continue; // Ensure currPoint is not undefined

        if (!polygons[currrPolygonIndex][currPoint.lat]) {
            polygons[currrPolygonIndex][currPoint.lat] = [];
        }
        polygons[currrPolygonIndex][currPoint.lat][currPoint.long] = points[currPoint.lat][currPoint.long];
        visited[currPoint.lat][currPoint.long] = true;

        const neighbors = [
            { lat: parseFloat((currPoint.lat - pointAccuracy).toFixed(2)), long: currPoint.long, alt: currPoint.alt },
            { lat: parseFloat((currPoint.lat + pointAccuracy).toFixed(2)), long: currPoint.long, alt: currPoint.alt },
            { lat: currPoint.lat, long: parseFloat((currPoint.long - pointAccuracy).toFixed(2)), alt: currPoint.alt },
            { lat: currPoint.lat, long: parseFloat((currPoint.long + pointAccuracy).toFixed(2)), alt: currPoint.alt }
        ];

        neighbors.forEach(neighbor => {
            if (isCoordinatesInPolygon(points, neighbor.lat, neighbor.long, neighbor.alt || 0)) {
                stack.push(points[neighbor.lat][neighbor.long]);
            }
        });
    }
}

export const divideToPolygons = (points: Point[][]): Point[][][] => {
    initArrays(points);

    Object.keys(points).sort().forEach((lat) => {
        Object.keys(points[lat as any as number]).sort().forEach((long) => {
            if (!visited[lat as any as number][long as any as number]) {
                polygons[currrPolygonIndex] = [];
                findPolygonNonRecursive(points, points[lat as any as number][long as any as number]);
                currrPolygonIndex++;
            }
        })
    });

    return polygons;
}
