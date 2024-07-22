type Point = {
  lat: number;
  lng: number;
  alt?: number;
};

// Helper function to calculate the centroid of the points
const calculateCentroid = (points: Point[]): Point => {
  let x = 0,
    y = 0;
  points.forEach((point) => {
    x += point.lat;
    y += point.lng;
  });
  return { lat: x / points.length, lng: y / points.length };
};

// Helper function to calculate the angle of a point relative to the centroid
const calculateAngle = (center: Point, point: Point): number => {
  return Math.atan2(point.lng - center.lng, point.lat - center.lat);
};

// Function to order the points around the centroid
export const orderPoints = (points: Point[]): any[] => {
  const centroid = calculateCentroid(points);
  return points
    .slice()
    .sort((a, b) => calculateAngle(centroid, a) - calculateAngle(centroid, b))
    .map((point) => {
      return { lat: point.lat, lng: point.lng, alt: point.alt };
    });
};

// Function to calculate the area of an irregular polygon
export const calculatePolygonArea = (points: Point[]): number => {
  const orderedPoints = orderPoints(points);
  let area = 0;
  const n = orderedPoints.length;

  for (let i = 0; i < n; i++) {
    const { lat: x1, lng: y1 } = orderedPoints[i];
    const { lat: x2, lng: y2 } = orderedPoints[(i + 1) % n]; // Ensure the last point connects to the first point

    area += x1 * y2 - x2 * y1;
  }

  return Math.abs(area / 2);
};
