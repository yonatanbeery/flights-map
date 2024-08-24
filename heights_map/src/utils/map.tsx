import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Popup, Polygon } from 'react-leaflet';
import polygons from "../../../polygonsCoordinates.json";
import pointHeights from "../../../maxHeights.json";
import { Box, IconButton, Input, List, ListItem, Paper, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RangeSlider from './slider';
import DeleteIcon from '@mui/icons-material/Delete';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';

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

interface DrawedPolygon {
  name: string;
  points: Point[];
}

  export const SimpleMap = () => {
    const state = {
      center: { lat: 33.6, lng: 36.5},
      zoom: 9,
    };

    const [cursorLocation, setCursorLocation] = useState(state.center);
    const [filteredHeights, setFilteredHeights] = useState<number[]>([500,10000]);
    const [presentedPolygons, setPresentedPolygons] = useState<Point[][]>([]);
    const [drawedPolygons, setDrawedPolygons] = useState<DrawedPolygon[]>([]);
    const [currentPolygon, setCurrentPolygon] = useState<DrawedPolygon>();
    const [updateFlag, setUpdateFlag] = useState<number>(0);
    const cursorRef = useRef();
    cursorRef.current = cursorLocation as any;

    useEffect(() => { 
      setPresentedPolygons(polygons.filter((polygon: Point[]) => polygon[0].alt >= filteredHeights[0] && polygon[0].alt <= filteredHeights[1]))
    },[filteredHeights])

    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown, { once: true });
    },[updateFlag]);
    
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

    const heightsInformation = (
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
    );

    const editPolygon = (editedPolygon: DrawedPolygon, index: number) => (
      <ListItem>
      <Box key={`${editPolygon.name}-${index}`} sx={{width:"100%", background:`${currentPolygon === editedPolygon ? "#3498db" : "white"}`}}>
        <IconButton aria-label="edit" onClick={() => setCurrentPolygon(editedPolygon)}>
          <EditLocationAltIcon/>
        </IconButton>
        <Input sx={{width:"5rem"}} value={editedPolygon.name} onChange={(text) => {
          const newPolygon = {...editedPolygon, name:text.target.value};
          setDrawedPolygons(drawedPolygons.map(polygon => {return polygon === editedPolygon ? newPolygon : polygon}));
          setCurrentPolygon(newPolygon);
        }
          }/>
          {editedPolygon.points.map((point, index) => 
            <Box key={`${editedPolygon.name}-${index}`} sx={{display:"flex", flexDirection:"row"}}>
              <IconButton aria-label="remove" onClick={() => {
                const newPolygon = {name: editedPolygon.name, points:editedPolygon.points.filter(polygonPoint => polygonPoint.lat !== point.lat || polygonPoint.lng !== point.lng)};
                setDrawedPolygons(drawedPolygons.map(polygon => 
                   polygon === currentPolygon ? newPolygon : polygon
                ))
                setCurrentPolygon(newPolygon);
                document.removeEventListener('keydown', handleKeyDown);
                setUpdateFlag(updateFlag+1);
              }}>
                <DeleteIcon/>
              </IconButton>
              <Typography>
              lat: {point.lat}, lng: {point.lng}
              </Typography>
            </Box>
          )}
        <hr/>
      </Box>
      </ListItem>
    )

    const polygonsDrawing = (
      <Paper style={{zIndex:"1000", padding:"1rem", width:"19rem", position:"absolute", background: "#f2f2f2",marginLeft:"1rem", marginTop: "5rem"}}>
      <Typography>
        Drawed polygons:
      </Typography>
      <List sx={{maxHeight:"25rem", overflow: 'auto',}}>
      {drawedPolygons.map((polygon, index) => editPolygon(polygon, index))}
      </List>
      <IconButton aria-label="add" onClick={() => setDrawedPolygons([...drawedPolygons, {name:"", points:[]}])}>
        <AddCircleOutlineIcon />
      </IconButton>
      </Paper>
    );
    
    const handleKeyDown = (event: any) => {
      if (event.key === 'Enter') {
        const point = cursorRef.current as any;
        const newPolygon = {name: currentPolygon?.name || "", points:[...currentPolygon?.points || [], {lat: +point.lat.toFixed(6), lng: +point.lng.toFixed(6), alt: 0}]};
        setDrawedPolygons(drawedPolygons.map(polygon => 
           polygon === currentPolygon ? newPolygon : polygon
        ))
        setCurrentPolygon(newPolygon);
      }
      setUpdateFlag(updateFlag+1);
    }

    return (
      <div>
        {polygonsDrawing}
        {heightsInformation}
        <MapContainer center={state.center} zoom={state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {presentedPolygons.map((polygon => renderedPoints(polygon)))}
          {drawedPolygons.map((polygon => polygon.points.length > 2 && renderedPoints(polygon.points)))}
        </MapContainer>
      </div>);
  }
