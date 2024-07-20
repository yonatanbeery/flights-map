import { Component } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export class SimpleMap extends Component {
  state = {
    center: {lat: 33.15, lng: 35.8},
    zoom: 9,
  };

  render() {
    const renderedPoints = (lat: number, lng:number) => (
      <Marker position={{lat, lng}}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
    )

    const points:{lat:number, lng:number}[] = [{lat: 33.15, lng:35.8}, {lat: 33.1, lng:35.7}]

    return (
      <div style={{  height: '600px', width: '100%'}}>
        <MapContainer center={this.state.center} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {points.map((point => renderedPoints(point.lat, point.lng)))}
        </MapContainer>
      </div>
    );
  }
}

