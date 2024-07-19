import axsios from "axios";
import { getAltitudeResponse, Point } from "./types";

const baseUrl = 'https://api.open-elevation.com/api/v1/lookup';

export const getAltitudes = async (points: Point[]): Promise<getAltitudeResponse> => {
    let locations = '';
    points.forEach((point) => {
        locations += `${point.lat},${point.long}|`;
    });

    return (await axsios.get(`${baseUrl}?locations=${locations}`)).data;
}