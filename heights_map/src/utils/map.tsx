import { Box, Button, Input, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { MapContainer, Polygon, Popup, TileLayer } from 'react-leaflet';
import defaultPolygons from '../../polygonsCoordinates.json';
import { getPolygons } from '../coordinates/app';
import { PolygonDrawing } from './drawPolygons';
import RangeSlider from './slider'
import { DrawedPolygon, MapPoint } from './types' 

const getColor = (alt: number): string => {
	if (alt === 500) return '';
	else if (alt === 1000) return '#48c9b0';
	else if (alt === 1500) return '#3498db';
	else if (alt === 2000) return '#2874a6';
	else if (alt === 2500) return '#1b4f72';
	else if (alt === 3000) return '#58d68d';
	else if (alt === 3500) return '#52be80';
	else if (alt === 4000) return '#27ae60';
	else if (alt === 4500) return '#1e8449';
	else if (alt === 5000) return '#f7dc6f';
	else if (alt === 5500) return '#f4d03f';
	else if (alt === 6000) return '#f5b041';
	else if (alt === 6500) return '#f39c12';
	else if (alt === 7000) return '#e67e22';
	else if (alt === 7500) return '#ec7063';
	else if (alt === 8000) return '#e74c3c';
	else if (alt === 8500) return '#c0392b';
	else if (alt === 9000) return '#a93226';
	else if (alt === 9500) return '#8e44ad';
	else if (alt === 10000) return '#4a235a';
	else if (alt === 99999) return '#000000';
	else return '#FFFFFF';
};

export const areaLimits = {
	min: {
		lat: 33.09,
		long: 35.08,
	},
	max: {
		lat: 34.72,
		long: 36.65,
	},
};

export const SimpleMap = () => {
	const state = {
		center: { lat: 33.6, lng: 36.5 },
		zoom: 9,
	};

	const [polygons, setPolygons] = useState(defaultPolygons);
	const [cursorLocation, setCursorLocation] = useState(state.center);
	const [filteredHeights, setFilteredHeights] = useState<number[]>([
		500, 10000,
	]);
	const [presentedPolygons, setPresentedPolygons] = useState<MapPoint[][]>([]);
	const [drawedPolygons, setDrawedPolygons] = useState<DrawedPolygon[]>([]);
	const [warningRadius, setWarningRadius] = useState(10);

	useEffect(() => {
		setPresentedPolygons(
			polygons.filter(
				(polygon: MapPoint[]) =>
					polygon[0].alt >= filteredHeights[0] &&
					polygon[0].alt <= filteredHeights[1]
			)
		);
	}, [filteredHeights, polygons]);

	const renderedPoints = (polygon: MapPoint[], description: string) => {
		return (
			<Polygon
				key={`${polygon[0].alt}-${polygon[0].lat}-${polygon[0].lng}`}
				eventHandlers={{ mousemove: (e) => setCursorLocation(e.latlng) }}
				positions={polygon}
				color={getColor(polygon[0].alt)}
			>
				<Popup>{description}</Popup>
			</Polygon>
		);
	};

	const heightsInformation = (
		<Paper
			style={{
				zIndex: '1000',
				padding: '1rem',
				width: '19rem',
				position: 'absolute',
				background: '#f2f2f2',
				bottom: '1rem',
			}}
		>
			<Typography>lat: {cursorLocation.lat.toFixed(6)}</Typography>
			<Typography>lng: {cursorLocation.lng.toFixed(6)}</Typography>
			<hr />
			<div>
				<Typography>סינון גבהים</Typography>
				<RangeSlider
					filteredHeights={filteredHeights}
					setFilteredHeights={setFilteredHeights}
				/>
			</div>
			<hr />
			<div
				style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
			>
				<Button
					aria-label="add"
					onClick={async () => setPolygons(await getPolygons(warningRadius))}
				>
					חישוב מעפ״ש לפי רדיוס
				</Button>
				<Input
					sx={{ width: '2.5rem', marginX: '0.5rem' }}
					type="number"
					defaultValue={warningRadius}
					onChange={(event) => setWarningRadius(+event?.target.value)}
				/>
				<Typography>ק״מ</Typography>
			</div>
		</Paper>
	);

	const backgroundPolygon = (
		<Polygon
			key={`background polygon`}
			color=""
			fillOpacity={0}
			eventHandlers={{ mousemove: (e) => setCursorLocation(e.latlng) }}
			positions={[
				{ lat: areaLimits.min.lat - 1, lng: areaLimits.min.long - 1 },
				{ lat: areaLimits.min.lat - 1, lng: areaLimits.max.long + 1 },
				{ lat: areaLimits.max.lat + 1, lng: areaLimits.max.long + 1 },
				{ lat: areaLimits.max.lat + 1, lng: areaLimits.min.long - 1 },
			]}
		></Polygon>
	);

	return (
		<div>
			<Box
				sx={{
					direction: 'rtl',
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				<PolygonDrawing
					cursorLocation={cursorLocation}
					drawedPolygons={drawedPolygons}
					setDrawedPolygons={setDrawedPolygons}
				/>
				{heightsInformation}
			</Box>
			<MapContainer center={state.center} zoom={state.zoom}>
				<TileLayer
					attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
				/>
				{backgroundPolygon}
				{presentedPolygons.map((polygon) =>
					renderedPoints(
						polygon,
						`גובה מעפ״ש מינימלי ללא תוספת - ${polygon[0].alt} רגל`
					)
				)}
				{drawedPolygons.map(
					(polygon) =>
						polygon.points.length > 2 &&
						renderedPoints(polygon.points, `${polygon.name}`)
				)}
			</MapContainer>
		</div>
	);
};
