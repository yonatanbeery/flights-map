import axsios, { AxiosResponse } from "axios";
import { getAltitudeResponse } from "./types";

const baseUrl = 'https://api.open-elevation.com/api/v1/lookup';

export const getAltitude = async (lat: number, long: number): Promise<getAltitudeResponse> => {
    return (await axsios.get(`${baseUrl}?locations=${lat},${long}`)).data;
}