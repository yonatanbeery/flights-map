import { Point } from "../utils/types";
import { pointAccuracy } from "../utils/globals";
import { convexHull } from "./convexHull";
import {getVectorDistance, getLatDistance,getLongDistance} from "./radiusAbovePoint";

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

//getVectorDistance(getLatDistance(lat, point.lat), getLongDistance(long, point.long))
export const sortBorderPoints = (borderPoints: Point[]):any[] => {
    if(borderPoints.length < 4) return borderPoints.map(point => ({lat: point.lat, lng: point.long, alt: point.alt}));
    const polygonPoints = convexHull(borderPoints);

    // borderPoints.forEach(point => {
    //     if(!polygonPoints.find(polyPoint => polyPoint === point)) {
    //         let closestPointIndex = 0;
    //         let closestPointDistance = getVectorDistance(getLatDistance(polygonPoints[0].lat, point.lat), getLongDistance(polygonPoints[0].long, point.long))
    //         for(let i = 0; i < polygonPoints.length; i++) {
    //             const newDistance = getVectorDistance(getLatDistance(polygonPoints[i].lat, point.lat), getLongDistance(polygonPoints[i].long, point.long))
    //             if(newDistance<closestPointDistance) {
    //                 closestPointDistance = newDistance;
    //                 closestPointIndex = i;
    //             }
    //         }

    //         const previousPointIndex = closestPointIndex == 0 ? polygonPoints.length - 1 : closestPointIndex - 1
    //         const nextPointIndex = closestPointIndex == polygonPoints.length - 1 ? 0 : closestPointIndex + 1            
            
    //         const previousPointDistance = getVectorDistance(getLatDistance(polygonPoints[previousPointIndex].lat, point.lat), getLongDistance(polygonPoints[previousPointIndex].long, point.long))
    //         const nextPointDistance = getVectorDistance(getLatDistance(polygonPoints[nextPointIndex].lat, point.lat), getLongDistance(polygonPoints[nextPointIndex].long, point.long))
    //         polygonPoints.splice(nextPointDistance < previousPointDistance ? nextPointIndex : previousPointIndex,0,point);
    //     }
    //     })

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