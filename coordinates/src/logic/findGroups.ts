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

const sortBorderPoints = (borderPoints: Point[]):Point[] => {
    const sortedPoints = []
    const addPointToSortedArray = (point) => {
        sortedPoints.push()
    }

    //{lat: polygon[lat][long].lat, lng: polygon[lat][long].long, alt: polygon[lat][long].alt}
    borderPoints.forEach(_ => sortedPoints.push())
    borderPoints.forEach(point => addPointToSortedArray(point))
    return sortedPoints
}