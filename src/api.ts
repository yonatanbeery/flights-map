import axsios, { AxiosResponse } from "axios";

const baseUrl = 'https://api.open-elevation.com/api/v1/lookup';

export const getAltitude = async (lat: number, long: number): Promise<AxiosResponse> => {
    return (await axsios.get(`${baseUrl}?locations=${lat},${long}`)).data;
}