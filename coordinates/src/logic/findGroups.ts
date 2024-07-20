import { Point } from "../utils/types";
import { pointAccuracy } from "../utils/globals";

export const getBorderPoints = (polygon: Point[][]):Point[] => {
    const borderPoints: any[] = [];
    Object.keys(polygon).forEach(lat => {
        Object.keys(polygon[lat]).forEach(long => {
            if(!isNotBorderPoint(polygon[lat][long], polygon) && !isOnStrightBorderLine(polygon[lat][long], polygon))
                borderPoints.push(polygon[lat][long])
        })
    })
    borderPoints.sort((a,b) => a.long < b.long ? 1 : a.lat < b.lat ? 1 : 0)
    return borderPoints
}

const isNotBorderPoint = (point: Point, polygon: Point[][]):boolean => {
    
    return !!polygon[Number.parseFloat((point.lat + pointAccuracy).toFixed(2))]?.[point.long] &&
    !!polygon[point.lat]?.[Number.parseFloat((point.long + pointAccuracy).toFixed(2))] &&
    !!polygon[Number.parseFloat((point.lat - pointAccuracy).toFixed(2))]?.[point.long] &&
    !!polygon[point.lat]?.[Number.parseFloat((point.long - pointAccuracy).toFixed(2))]
}

const isOnStrightBorderLine = (point: Point, polygon: Point[][]):boolean => {
    return (!!polygon[Number.parseFloat((point.lat + pointAccuracy).toFixed(2))]?.[point.long] &&
    !!polygon[Number.parseFloat((point.lat - pointAccuracy).toFixed(2))]?.[point.long]) ||
    (!!polygon[point.lat]?.[Number.parseFloat((point.long + pointAccuracy).toFixed(2))] &&
    !!polygon[point.lat]?.[Number.parseFloat((point.long - pointAccuracy).toFixed(2))])
}

const getMinPoint = (points: Point[]):Point => {
    let minPoint = points[0]

    points.forEach((point) => {
        if(point.lat < minPoint.lat) minPoint = point
    })

    return minPoint
}

const closetPointFromLeft = (point: Point, points: Point[]):Point => {
    let closestPoint = points[0];
    points.forEach((comparedPoint) => {
        const angle = (closestPoint.lat - point.lat)/(closestPoint.long - point.long);
        if(angle > 0) closestPoint = comparedPoint
    }) 
    return closestPoint;
}

export const sortBorderPoints = (borderPoints: Point[]):Point[] => {
    if(borderPoints.length < 4) return borderPoints;

    const sortedPoints = [];
    const minPoint = getMinPoint(borderPoints)
    let nextPoint = minPoint;
    while(nextPoint !== minPoint ||sortedPoints.length === 0) {
        sortedPoints.push(nextPoint);
        nextPoint = closetPointFromLeft(nextPoint, borderPoints)
    }

    //{lat: polygon[lat][long].lat, lng: polygon[lat][long].long, alt: polygon[lat][long].alt}
    return sortedPoints
}