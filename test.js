// Helper function to calculate the cross product of vectors OA and OB
// A positive cross product indicates a counter-clockwise turn, 0 indicates a collinear point, and negative indicates a clockwise turn
const crossProduct = (O , A, B) => {
    return (A.lat - O.lat) * (B.long - O.long) - (A.long - O.long) * (B.lat - O.lat);
};

// Function to compute the convex hull using Graham Scan algorithm
const convexHull = (points) => {
    // Sort points lexicographically (by lat, then by long)
    const sortedPoints = [...points].sort((a, b) => a.lat - b.lat || a.long - b.long);

    // Build the lower hull
    const lowerHull = [];
    for (const point of sortedPoints) {
        while (lowerHull.length >= 2 && crossProduct(lowerHull[lowerHull.length - 2], lowerHull[lowerHull.length - 1], point) <= 0) {
            lowerHull.pop();
        }
        lowerHull.push(point);
    }

    // Build the upper hull
    const upperHull = [];
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

// Example usage
// const points = [
//     { lat: 0, long: 0 },
//     { lat: 1, long: 1 },
//     { lat: 2, long: 0 },
//     { lat: 1, long: -1 },
//     { lat: 0, long: 2 },
//     { lat: 2, long: 2 },
// ];

const polygon = [
    { lat: 34.41, long: 36.47, alt: 4000 },
    { lat: 34.41, long: 36.51, alt: 4000 },
    { lat: 34.42, long: 36.47, alt: 4000 },
    { lat: 34.42, long: 36.52, alt: 4000 },
    { lat: 34.43, long: 36.48, alt: 4000 },
    { lat: 34.43, long: 36.53, alt: 4000 },
    { lat: 34.44, long: 36.54, alt: 4000 },
    { lat: 34.45, long: 36.55, alt: 4000 },
    { lat: 34.46, long: 36.56, alt: 4000 },
    { lat: 34.46, long: 36.57, alt: 4000 },
    { lat: 34.47, long: 36.57, alt: 4000 },
    { lat: 34.47, long: 36.59, alt: 4000 },
    { lat: 34.48, long: 36.59, alt: 4000 },
    { lat: 34.48, long: 36.65, alt: 4000 }
  ]

const hull = convexHull(polygon);
console.log(hull); // Output the points of the convex hull