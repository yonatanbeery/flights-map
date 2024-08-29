import { Box, Button, IconButton, Input, List, ListItem, Paper, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { DrawedPolygon } from "./types";
import DeleteIcon from '@mui/icons-material/Delete';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { LatLng } from "leaflet";

interface DrawerProps {
    cursorLocation: { lat: number, lng: number};
    drawedPolygons: DrawedPolygon[];
    setDrawedPolygons:React.Dispatch<React.SetStateAction<DrawedPolygon[]>>;
}

export const PolygonDrawing = (props: DrawerProps) => {
    const [currentPolygon, setCurrentPolygon] = useState<DrawedPolygon>();
    const currentRef = useRef();
    currentRef.current = currentPolygon as any;
    const polygonsRef = useRef();
    polygonsRef.current = props.drawedPolygons as any;
    const cursorRef = useRef();
    cursorRef.current = props.cursorLocation as any;
    
    const editPolygon = (editedPolygon: DrawedPolygon, index: number) => (
        <ListItem key={`${editPolygon.name}-${index}`}>
        <Box sx={{width:"100%", background:`${currentRef.current === editedPolygon ? "#3498db" : "white"}`}}>
          <IconButton aria-label="edit" onClick={() => setCurrentPolygon(editedPolygon)}>
            <EditLocationAltIcon/>
          </IconButton>
          <Input sx={{width:"8rem"}} placeholder={"שם פוליגון"} value={editedPolygon.name} onChange={(text) => {
            const newPolygon = {...editedPolygon, name:text.target.value};
            props.setDrawedPolygons(props.drawedPolygons.map(polygon => {return polygon === editedPolygon ? newPolygon : polygon}));
            setCurrentPolygon(newPolygon);
          }
            }/>
            {editedPolygon.points.map((point, index) => 
              <Box key={`${editedPolygon.name}-${index}`} sx={{display:"flex", flexDirection:"row"}}>
                <IconButton aria-label="remove" onClick={() => {
                  const newPolygon = {name: editedPolygon.name, points:editedPolygon.points.filter(polygonPoint => polygonPoint.lat !== point.lat || polygonPoint.lng !== point.lng)};
                  props.setDrawedPolygons(props.drawedPolygons.map(polygon => 
                     polygon === currentRef.current ? newPolygon : polygon
                  ))
                  setCurrentPolygon(newPolygon);
                }}>
                  <DeleteIcon/>
                </IconButton>
                <Typography>
                lat: {point.lat}, lng: {point.lng}
                </Typography>
              </Box>
            )}
        </Box>
        </ListItem>
      )

      const handleKeyDown = (event: any) => {
        event.preventDefault();
          const point = cursorRef.current as any as LatLng;
          const polygons = polygonsRef.current as any as DrawedPolygon[];
          const currentEditedPolygon = currentRef.current as any as DrawedPolygon;
          const newPolygon = {name: currentEditedPolygon.name || "", points:[...currentEditedPolygon.points || [], {lat: +point.lat.toFixed(6), lng: +point.lng.toFixed(6), alt: 99999}]};
          props.setDrawedPolygons(polygons.map(polygon => 
             polygon === currentEditedPolygon ? newPolygon : polygon
          ))
          setCurrentPolygon(newPolygon);
      }

      useEffect(() => {
        document.addEventListener('contextmenu', handleKeyDown);
      },[]);
  
      return (
        <Paper style={{zIndex:"1000", padding:"1rem", width:"19rem", position:"absolute", background: "#f2f2f2",marginLeft:"1rem", marginTop: "5rem"}}>
        <Typography>
          פוליגונים שנוצרו
        </Typography>
        <List sx={{maxHeight:"20rem", overflow: 'auto',}}>
        {props.drawedPolygons.map((polygon, index) => editPolygon(polygon, index))}
        </List>
        <Button aria-label="add" onClick={() => props.setDrawedPolygons([...props.drawedPolygons, {name:"", points:[]}])}>
          <AddCircleOutlineIcon />
          הוסף פוליגון 
        </Button>
        <Typography>
          בשביל להוסיף נצ לפוליגון, יש לבחור פוליגון לעריכה ולאחר מכן ללחוץ על מקש ימני מעל הנצ הרצוי
        </Typography>
        </Paper>
      );
}