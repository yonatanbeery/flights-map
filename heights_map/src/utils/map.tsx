import { Component, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Popup, Polygon } from 'react-leaflet';
import polygons from "../../../polygonsCoordinates.json";
import pointHeights from "../../../maxHeights.json";
import MultipleSelectCheckmarks from './multipleSelect';
import { Typography } from '@mui/material';

interface Point {
  lat: number;
  lng:number;
  alt: number;
}

const allPoints = pointHeights as Record<string, Record<string, Point>>

const getColor = (alt: number):string => {
  if(alt === 500) return ""
  else if(alt === 1000) return "#6fa8dc"
  else if(alt===1500) return "#3d85c6"
  else if(alt===2000) return "#0b5394"
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
  else return "#FFFFFF"
}

  export const SimpleMap = () => {
    const state = {
      center: { lat: 34.2, lng: 36.02},
      zoom: 10,
    };

    const heightOptions = Array.from({length: 21}, (_, i) => (i+1)*500)    
    const [cursorLocation, setCursorLocation] = useState(state.center)
    const [filteredHeights, setFilteredHeights] = useState<number[]>(heightOptions)
    const [presentedPolygons, setPresentedPolygons] = useState<Point[][]>(polygons)

    useEffect(() => { 
      setPresentedPolygons(polygons.filter((polygon: Point[]) => filteredHeights.includes(polygon[0].alt)))
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
        <div style={{zIndex:"1000", width:"11rem", position:"absolute", background: "#f2f2f2",marginLeft:"1rem", marginTop: "10rem"}}>
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
            <MultipleSelectCheckmarks options={heightOptions} filteredHeights={filteredHeights} setFilteredHeights={setFilteredHeights}/>
          </div>
        </div>
        <MapContainer center={state.center} zoom={state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {presentedPolygons.map((polygon => renderedPoints(polygon)))}
        </MapContainer>
      </div>);
  }
