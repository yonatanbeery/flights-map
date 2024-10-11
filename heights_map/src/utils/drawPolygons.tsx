import {
	Box,
	Button,
	IconButton,
	Input,
	List,
	ListItem,
	Paper,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { DrawedPolygon } from './types';
import DeleteIcon from '@mui/icons-material/Delete';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface DrawerProps {
	cursorLocation: { lat: number; lng: number };
	drawedPolygons: DrawedPolygon[];
	setDrawedPolygons: React.Dispatch<React.SetStateAction<DrawedPolygon[]>>;
}

export const PolygonDrawing = (props: DrawerProps) => {
	const [currentPolygon, setCurrentPolygon] = useState<DrawedPolygon>();

	const editPolygon = (editedPolygon: DrawedPolygon, index: number) => (
		<ListItem
			sx={{
				width: '100%',
				background: `${currentPolygon === editedPolygon ? '#3498db' : 'white'}`,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'start',
			}}
			key={`${editPolygon.name}-${index}`}
		>
			<Box
				sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}
			>
				<Box>
					<IconButton
						aria-label="edit"
						onClick={() =>
							currentPolygon === editedPolygon
								? setCurrentPolygon({ name: '', points: [] })
								: setCurrentPolygon(editedPolygon)
						}
					>
						<EditLocationAltIcon />
					</IconButton>
					<Input
						sx={{ width: '8rem' }}
						placeholder={'שם פוליגון'}
						value={editedPolygon.name}
						onChange={(text) => {
							const newPolygon = { ...editedPolygon, name: text.target.value };
							props.setDrawedPolygons(
								props.drawedPolygons.map((polygon) => {
									return polygon === editedPolygon ? newPolygon : polygon;
								})
							);
							setCurrentPolygon(newPolygon);
						}}
					/>
				</Box>
				<IconButton
					aria-label="remove"
					onClick={() => {
						props.setDrawedPolygons([
							...props.drawedPolygons.filter((polygon) => {
								return polygon !== editedPolygon;
							}),
						]);

						setCurrentPolygon(undefined);
					}}
				>
					<DeleteIcon />
				</IconButton>
			</Box>
			{currentPolygon === editedPolygon && polygonPointsList(editedPolygon)}
		</ListItem>
	);

	const polygonPointsList = (editedPolygon: DrawedPolygon) => {
		return editedPolygon.points.map((point, index) => (
			<Box
				key={`${editedPolygon.name}-${index}`}
				sx={{
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'start',
				}}
			>
				<IconButton
					aria-label="remove"
					onClick={() => {
						const newPolygon = {
							name: editedPolygon.name,
							points: editedPolygon.points.filter(
								(polygonPoint) =>
									polygonPoint.lat !== point.lat ||
									polygonPoint.lng !== point.lng
							),
						};
						props.setDrawedPolygons(
							props.drawedPolygons.map((polygon) =>
								polygon === currentPolygon ? newPolygon : polygon
							)
						);
						setCurrentPolygon(newPolygon);
					}}
				>
					<DeleteIcon />
				</IconButton>
				<Typography>
					lat: {point.lat}, lng: {point.lng}
				</Typography>
			</Box>
		));
	};

	const handleKeyDown = (event: any) => {
		event.preventDefault();
		if (currentPolygon) {
			const newPolygon = {
				name: currentPolygon.name || '',
				points: [
					...(currentPolygon.points || []),
					{
						lat: +props.cursorLocation.lat.toFixed(6),
						lng: +props.cursorLocation.lng.toFixed(6),
						alt: 99999,
					},
				],
			};
			props.setDrawedPolygons(
				props.drawedPolygons.map((polygon) =>
					polygon === currentPolygon ? newPolygon : polygon
				)
			);
			setCurrentPolygon(newPolygon);
		}
	};

	useEffect(() => {
		document.addEventListener('contextmenu', handleKeyDown);
		return () => {
			document.removeEventListener('contextmenu', handleKeyDown);
		};
	}, [currentPolygon, props.drawedPolygons, props.cursorLocation]);

	return (
		<Paper
			style={{
				zIndex: '1000',
				padding: '1rem',
				width: '19rem',
				marginTop: '1rem',
				position: 'absolute',
				background: '#f2f2f2',
				direction: 'rtl',
				maxHeight: '60%',
			}}
		>
			<Typography>פוליגונים שנוצרו</Typography>
			<List sx={{ maxHeight: '20rem', overflow: 'auto' }}>
				{props.drawedPolygons.map((polygon, index) =>
					editPolygon(polygon, index)
				)}
			</List>
			<Button
				aria-label="add"
				onClick={() =>
					props.setDrawedPolygons([
						...props.drawedPolygons,
						{ name: '', points: [] },
					])
				}
			>
				<AddCircleOutlineIcon />
				הוסף פוליגון
			</Button>
			<Typography>
				בשביל להוסיף נצ לפוליגון, יש להוסיף פוליגון ולבחור אותו, ולאחר מכן ללחוץ
				על מקש ימני מעל הנצ הרצוי
			</Typography>
		</Paper>
	);
};
