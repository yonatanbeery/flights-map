import { Component } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';

export class SimpleMap extends Component {
  state = {
    center: {lat: 33.15, lng: 35.8},
    zoom: 9,
  };

  render() {
    const renderedPoints = (polygon: {lat: number, lng:number}[]) => (
      <Polygon positions={polygon}>
      <Popup>
        minimum height: ...
      </Popup>
    </Polygon>
    )

    const polygons:{lat:number, lng:number}[][] = [[{lat: 33.15, lng:35.8}, {lat: 33.1, lng:35.7}, {lat: 33.2, lng:35.6}],[{lat: 34.1, lng:35.2}, {lat: 33.9, lng:35.2}, {lat: 34, lng:35}]]

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

