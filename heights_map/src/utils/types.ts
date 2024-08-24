export interface Point {
    lat: number;
    lng:number;
    alt: number;
  }

  export interface DrawedPolygon {
    name: string;
    points: Point[];
  }
  