import { Component } from 'react';
import { MapContainer, TileLayer, Popup, Polygon } from 'react-leaflet';
import polygons from "../../polygonsCoordinates.json";

interface Point {
  lat: number;
  lng:number;
  alt: number
}

const getColor = (alt: number):string => {
  if(alt === 1000) return "#0b5394"
  else if(alt===1500) return "#3d85c6"
  else if(alt===2000) return "#6fa8dc"
  else if(alt===2500) return "#38761d"
  else if(alt===3000) return "#6aa84f"
  else if(alt===3500) return "#93c47d"
  else if(alt===4000) return "#ffe599"
  else if(alt===4500) return "#ffd966"
  else if(alt===5000) return "#f1c232"
  else if(alt===5500) return "#f6b26b"
  else if(alt===6000) return "#e69138"
  else if(alt===6500) return "#c27ba0"
  else if(alt===7000) return "#e06666"
  else if(alt===7500) return "#8e7cc3"
  else if(alt===8000) return "#a64d79"
  else if(alt===8500) return "#cc0000"
  else if(alt===9000) return "#674ea7"
  else if(alt===9500) return "#741b47"
  else if(alt===10000) return "#990000"
  else if(alt===10500) return "#351c75"
  else if(alt===11000) return "#FFFFFF"

  else return ""
}

export class SimpleMap extends Component {
  state = {
    center: { lat: 34.2, lng: 36.02},
    zoom: 10,
  };

  render() {
    const renderedPoints = (polygon: Point[]) => (
      <Polygon positions={polygon} color={getColor(polygon[0].alt)}>
      <Popup>
        minimum height: {polygon[0].alt}
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

