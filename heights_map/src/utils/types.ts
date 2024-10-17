export interface MapPoint {
	lat: number;
	lng: number;
	alt: number;
}

export interface DrawedPolygon {
	name: string;
	points: MapPoint[];
}
