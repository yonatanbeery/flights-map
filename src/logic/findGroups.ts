import { Point } from "../utils/types";
import { areaLimits } from "../utils/globals";

export const findHeightGroups = (heights: Point[][]):Point[][] | any => {
    for(let lat = Number.parseFloat((areaLimits.min.lat).toFixed(2)); lat < Number.parseFloat((areaLimits.max.lat).toFixed(2)); lat = Number.parseFloat((lat + 0.01).toFixed(2))) {
        for(let long = Number.parseFloat((areaLimits.min.long).toFixed(2)); long < Number.parseFloat((areaLimits.max.long).toFixed(2)); long = Number.parseFloat((long + 0.01).toFixed(2))) {
            
        }
    }
}
