import { Point } from "../utils/types";
import { areaLimits, pointAccuracy } from "../utils/globals";

export const getBorderPoints = (heights: Point[][]):Point[][] | any => {
    const borderPoints: Point[] = [];
    for(let lat = Number.parseFloat((areaLimits.min.lat).toFixed(2)); lat <= Number.parseFloat((areaLimits.max.lat).toFixed(2)); lat = Number.parseFloat((lat + 0.01).toFixed(2))) {
        for(let long = Number.parseFloat((areaLimits.min.long).toFixed(2)); long <= Number.parseFloat((areaLimits.max.long).toFixed(2)); long = Number.parseFloat((long + 0.01).toFixed(2))) {
            if(!soroundedBySameHeight(heights[lat][long], heights)) borderPoints.push(heights[lat][long])
        }
    }
    return borderPoints
}

const soroundedBySameHeight = (point: any, heights: Point[][]):boolean => {
    const isEdge = (point.lat == areaLimits.min.lat || point.long == areaLimits.min.long || 
        point.lat == areaLimits.max.lat || point.long == areaLimits.max.long)

    return !isEdge && point.alt === heights[Number.parseFloat((Number.parseFloat(point.lat) + pointAccuracy).toFixed(2))][point.long].alt &&
    point.alt === heights[point.lat][Number.parseFloat((Number.parseFloat(point.long) + pointAccuracy).toFixed(2))].alt &&
    point.alt === heights[Number.parseFloat((Number.parseFloat(point.lat) - pointAccuracy).toFixed(2))][point.long].alt &&
    point.alt === heights[point.lat][Number.parseFloat((Number.parseFloat(point.long) - pointAccuracy).toFixed(2))].alt
}