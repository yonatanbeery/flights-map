import { Component } from 'react';
import { MapContainer, TileLayer, Popup, Polygon } from 'react-leaflet';
import polygons from "../../polygonsCoordinates.json";

interface Point {
  lat: number;
  lng:number;
  alt: number
}

export class SimpleMap extends Component {
  state = {
    center: { lat: 34.2, lng: 36.02},
    zoom: 10,
  };

  render() {
    console.log(polygons)
    const renderedPoints = (polygon: Point[]) => (
      <Polygon positions={polygon}>
      <Popup>
        minimum height: {polygon[0].alt}
        points: {polygon.map((p) => (`[${p.lat}, ${p.lng}] `))}
      </Popup>
    </Polygon>
    )

    return (
      <div style={{  height: '600px', width: '100%'}}>
        <MapContainer center={this.state.center} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {polygons.map((polygon => renderedPoints(polygon)))}
        </MapContainer>
      </div>
    );
  }
}

