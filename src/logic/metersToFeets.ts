import { Point } from "../utils/types";
import { meterToFeet } from "../utils/globals";

export const convertMetersToFeets = (points: Point[][]) => {
    const convertedPoints: Point[][] = [];
    
    Object.keys(points).forEach((lat) => {
        convertedPoints[lat] = [];
        Object.keys(points[lat]).forEach((long) => {
            convertedPoints[lat][long] = {...(convertedPoints[lat][long]), alt: convertedPoints[lat][long].alt * meterToFeet};
        })
    });

    return convertedPoints;
}