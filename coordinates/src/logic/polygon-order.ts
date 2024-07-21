import { Point } from "../utils/types"

// Helper function to calculate the cross product of vectors OA and OB
// A positive cross product indicates a counter-clockwise turn, 0 indicates a collinear point, and negative indicates a clockwise turn
const crossProduct = (O: Point, A: Point, B: Point): number => {
    return (A.lat - O.lat) * (B.long - O.long) - (A.long - O.long) * (B.lat - O.lat);
};

// Function to compute the convex hull using Graham Scan algorithm
const sortPolygonPoints = (polygon: Point[]): Point[] => {
    // Sort points lexicographically (by lat, then by long)
    const sortedPoints = [...polygon].sort((a, b) => a.lat - b.lat || a.long - b.long);

    // Build the lower hull
    const lowerHull: Point[] = [];
    for (const point of sortedPoints) {
        while (lowerHull.length >= 2 && crossProduct(lowerHull[lowerHull.length - 2], lowerHull[lowerHull.length - 1], point) <= 0) {
            lowerHull.pop();
        }
        lowerHull.push(point);
    }

    // Build the upper hull
    const upperHull: Point[] = [];
    for (let i = sortedPoints.length - 1; i >= 0; i--) {
        const point = sortedPoints[i];
        while (upperHull.length >= 2 && crossProduct(upperHull[upperHull.length - 2], upperHull[upperHull.length - 1], point) <= 0) {
            upperHull.pop();
        }
        upperHull.push(point);
    }

    // Remove the last point of each half because it is repeated at the beginning of the other half
    upperHull.pop();
    lowerHull.pop();

    // Concatenate lower and upper hulls to get the convex hull
    return lowerHull.concat(upperHull);
}

export const sortPolygons = (polygons: Point[][]): Point[][] => {
    const sortedPolygons = [];
    polygons.forEach((polygon) => {
        sortedPolygons.push(sortPolygonPoints(polygon));
    });

    return sortedPolygons;
}