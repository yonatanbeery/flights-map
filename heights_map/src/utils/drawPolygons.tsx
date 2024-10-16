import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
import { MuiFileInput } from 'mui-file-input';
import { useEffect, useState } from 'react';
import { RiFileExcel2Fill } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import { DrawedPolygon } from './types';
import { toast } from 'react-toastify';

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

	const importPpolygonsFromExcel = (file: File | null) => {
		if (!file) {
			return;
		}

		const extantionIndex = file.name.lastIndexOf('.');
		const extantion = file.name.substring(extantionIndex + 1);

		if (extantion != 'xlsx') {
			toast.error("הסיומת של הקובץ חייבת להיות 'xlsx'");
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = new Uint8Array(e.target?.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: 'array' });
				const sheet = workbook.Sheets[workbook.SheetNames[0]];
				const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as (
					| string
					| number
				)[][];

				const points = jsonData.slice(1) as string[][];
				const names = jsonData[0] as string[];
				const polygons: DrawedPolygon[] = [];

				for (let col = 0; col < names.length; col++) {
					if (names[col].length === 0) {
						continue;
					}

					const currPolygon: DrawedPolygon = { name: names[col], points: [] };
					for (let row = 0; row < points.length; row++) {
						if (points[row][col].length === 0) {
							break;
						}

						const [lat, lng] = points[row][col].split(',').map(Number);
						currPolygon.points.push({ lat, lng, alt: 99999 });
					}
					polygons.push(currPolygon);
				}
				props.setDrawedPolygons(polygons);
				toast.success('הפוליגונים הועלו בהצלחה');
			} catch (e) {
				toast.error('הייתה בעיה בקריאת הפוליגונים מהקובץ');
			}
		};
		reader.readAsArrayBuffer(file);
	};

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
						<MuiFileInput
							id="fileInput"
							multiple={false}
							onChange={importPpolygonsFromExcel}
							sx={{ display: 'none' }}
						/>
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
								<CloudUploadIcon />
							</FormLabel>
						</Button>
						{/* <Input
							type="file"
							id="fileInput"
							style={{ display: 'none' }}
							onChange={importPpolygonsFromExcel}
						/>
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
								<CloudUploadIcon />
							</FormLabel>
						</Button> */}
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
