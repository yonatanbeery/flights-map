import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, Polygon } from 'react-leaflet';
import polygons from "../../../polygonsCoordinates.json";
import pointHeights from "../../../maxHeights.json";
import { Paper, Typography } from '@mui/material';
import RangeSlider from './slider';

interface Point {
  lat: number;
  lng:number;
  alt: number;
}

const allPoints = pointHeights as Record<string, Record<string, Point>>

const getColor = (alt: number):string => {
  if(alt === 500) return ""
  else if(alt === 1000) return "#48c9b0"
  else if(alt===1500) return "#3498db"
  else if(alt===2000) return "#2874a6"
  else if(alt===2500) return "#1b4f72"
  else if(alt===3000) return "#58d68d"
  else if(alt===3500) return "#52be80"
  else if(alt===4000) return "#27ae60"
  else if(alt===4500) return "#1e8449"
  else if(alt===5000) return "#f7dc6f"
  else if(alt===5500) return "#f4d03f"
  else if(alt===6000) return "#f5b041"
  else if(alt===6500) return "#f39c12"
  else if(alt===7000) return "#e67e22"
  else if(alt===7500) return "#ec7063"
  else if(alt===8000) return "#e74c3c"
  else if(alt===8500) return "#c0392b"
  else if(alt===9000) return "#a93226"
  else if(alt===9500) return "#8e44ad"
  else if(alt===10000) return "#4a235a"
  else return "#FFFFFF"
}

  export const SimpleMap = () => {
    const state = {
      center: { lat: 33.6, lng: 36.5},
      zoom: 9,
    };

    const [cursorLocation, setCursorLocation] = useState(state.center)
    const [filteredHeights, setFilteredHeights] = useState<number[]>([500,10000])
    const [presentedPolygons, setPresentedPolygons] = useState<Point[][]>([])

    useEffect(() => { 
      setPresentedPolygons(polygons.filter((polygon: Point[]) => polygon[0].alt >= filteredHeights[0] && polygon[0].alt <= filteredHeights[1]))
    },[filteredHeights])
    
    const renderedPoints = (polygon: Point[]) => {  
      return(
      <Polygon key={`${polygon[0].alt}-${polygon[0].lat}-${polygon[0].lng}`} eventHandlers={
        {mousemove: (e) => setCursorLocation(e.latlng)}
      } positions={polygon} color={getColor(polygon[0].alt)} >
      <Popup>
        minimum height: {polygon[0].alt}
      </Popup>
    </Polygon>
    )}

    return (
      <div>
        <Paper style={{zIndex:"1000", paddingLeft:"1rem", width:"17rem", position:"absolute", background: "#f2f2f2",marginLeft:"1rem", marginTop: "37rem"}}>
          <Typography>
          lat: {cursorLocation.lat.toFixed(6)}
          </Typography>
          <Typography>
          lng: {cursorLocation.lng.toFixed(6)}
          </Typography>
          <Typography>
          alt: {allPoints[cursorLocation.lat.toFixed(2).toString()]?.[cursorLocation.lng.toFixed(2).toString()]?.alt || 0}
          </Typography>
          <div>
            <Typography>filter heights:</Typography>
            <RangeSlider filteredHeights={filteredHeights} setFilteredHeights={setFilteredHeights}/>
          </div>
        </Paper>
        <MapContainer center={state.center} zoom={state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {presentedPolygons.map((polygon => renderedPoints(polygon)))}
        </MapContainer>
      </div>);
  }
