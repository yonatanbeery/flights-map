import { Point } from "../utils/types";
import { pointAccuracy } from "../utils/globals";
import { convexHull } from "./convexHull";

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

export const sortBorderPoints = (borderPoints: Point[]):any[] => {
    if(borderPoints.length < 4) return borderPoints.map(point => ({lat: point.lat, lng: point.long, alt: point.alt}));
    const polygonPoints = convexHull(borderPoints);

    let northPoint = polygonPoints[0]
    polygonPoints.forEach(point => {
        if(point.lat > northPoint.lat || (point.lat === northPoint.lat && point.long < northPoint.long)) northPoint=point
    })
    const northPointIndex = polygonPoints.findIndex(p => p===northPoint)

    polygonPoints.sort((a,b) => a.long < b.long ? 1 : 0)
    const leftPoints = polygonPoints.slice(0, northPointIndex);
    const rightPoints = polygonPoints.slice(northPointIndex, polygonPoints.length);
    
    const sortedPoints = []
    leftPoints.sort((a,b) => a.lat < b.lat ? 1 : 0).forEach(point => sortedPoints.push(point));
    rightPoints.sort((a,b) => a.lat > b.lat ? 1 : 0).forEach(point => sortedPoints.push(point));
    
    return polygonPoints.map(point => ({lat: point.lat, lng: point.long, alt: point.alt}))
}