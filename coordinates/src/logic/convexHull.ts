// Function to find the orientation of the triplet (p, q, r).
// Returns 0 if p, q, and r are collinear.
// Returns 1 if Clockwise.

import { Point } from "../utils/types";

// Returns 2 if Counterclockwise.
function orientaion(p, q, r) {
    const val = (q.long - p.long) * (r.lat - q.lat) - (q.lat - p.lat) * (r.long - q.long);
    if (val === 0) return 0;
    return (val > 0) ? 1 : 2;
}

// Function to find the convex hull of a set of points using the Gift Wrapping algorithm.
export const convexHull = (points:Point[]):Point[] => {
    const n = points.length;
    if (n < 3) return points;

    let hull = [];

    // Find the leftmost point
    let l = 0;
    for (let i = 1; i < n; i++) {
        if (points[i].lat < points[l].lat) {
            l = i;
        }
    }

    let p = l, q;
    do {
        // Add the current point to the hull
        hull.push(points[p]);

        // Search for a point 'q' such that orientation(p, q, x) is counterclockwise for all points 'x'
        q = (p + 1) % n;
        for (let i = 0; i < n; i++) {
            if (orientaion(points[p], points[i], points[q]) === 2) {
                q = i;
            }
        }

        // Now q is the most counterclockwise point with respect to p
        p = q;

    } while (p !== l);  // While we don't come to the first point

    return hull;
}

// Example usage
const points = [
    [0, 3], [1, 1], [2, 2], [4, 4],
    [0, 0], [1, 2], [3, 1], [3, 3]
];