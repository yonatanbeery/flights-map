import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import {
	Box,
	Button,
	FormLabel,
	IconButton,
	Input,
	List,
	ListItem,
	Paper,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { RiFileExcel2Fill } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import { DrawedPolygon } from './types';

interface DrawerProps {
	cursorLocation: { lat: number; lng: number };
	drawedPolygons: DrawedPolygon[];
	setDrawedPolygons: React.Dispatch<React.SetStateAction<DrawedPolygon[]>>;
}

export const PolygonDrawing = (props: DrawerProps) => {
	const [currentPolygon, setCurrentPolygon] = useState<DrawedPolygon>();

	const prepareDataForExcel = () => {
		const maxPoints = Math.max(
			...props.drawedPolygons.map((polygon) => polygon.points.length)
		);
		const result: any[] = [];

		for (let i = 0; i < maxPoints; i++) {
			const row: any = {};
			props.drawedPolygons.forEach((polygon) => {
				if (i < polygon.points.length) {
					const { lat, lng } = polygon.points[i];
					row[polygon.name] = `${lat}, ${lng}`;
				} else {
					row[polygon.name] = '';
				}
			});
			result.push(row);
		}

		return result;
	};

	const exportPolygonsToExcel = () => {
		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.json_to_sheet(prepareDataForExcel());

		XLSX.utils.book_append_sheet(workbook, worksheet, 'PointsData');

		const excelBuffer = XLSX.write(workbook, {
			bookType: 'xlsx',
			type: 'array',
		});

		const blob = new Blob([excelBuffer], {
			type: 'application/octet-stream',
		});
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.href = url;
		link.setAttribute('download', 'points_data.xlsx');

		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const importPpolygonsFromExcel = () => {};

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
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Typography>פוליגונים שנוצרו</Typography>
				{props.drawedPolygons.length > 0 ? (
					<Button
						variant="outlined"
						sx={{ gap: '0.5rem' }}
						onClick={exportPolygonsToExcel}
					>
						<Typography>יצא פוליגונים</Typography>
						<RiFileExcel2Fill />
					</Button>
				) : (
					<Box>
						<Input type="file" id="fileInput" style={{ display: 'none' }} />
						<Button variant="outlined">
							<FormLabel
								htmlFor="fileInput"
								sx={{
									display: 'flex',
									gap: '0.5rem',
									alignItems: 'center',
									color: 'inherit',
								}}
							>
								<Typography>יבא פוליגונים</Typography>
								<RiFileExcel2Fill />
							</FormLabel>
						</Button>
					</Box>
				)}
			</Box>
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
