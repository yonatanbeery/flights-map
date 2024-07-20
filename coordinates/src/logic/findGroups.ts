import { Point } from "../utils/types";
import { pointAccuracy } from "../utils/globals";

export const getBorderPoints = (polygon: Point[][]):Point[] => {
    const borderPoints: Point[] = [];
    Object.keys(polygon).forEach(lat => {
        Object.keys(lat).forEach(long => {
            if(!isNotBorderPoint(polygon[lat][long], polygon) && !isOnStrightBorderLine(polygon[lat][long], polygon)) borderPoints.push(polygon[lat][long])
        })
    })
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