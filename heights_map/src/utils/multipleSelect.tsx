import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

interface MultipleSelectProps {
    options: number[];
    filteredHeights: number[];
    setFilteredHeights: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function MultipleSelectCheckmarks(props: MultipleSelectProps) {
  const handleChange = (event: SelectChangeEvent<typeof props.filteredHeights>) => {
    const {
      target: { value },
    } = event;
    props.setFilteredHeights(
      typeof value === 'string' ? value.split(',').map(value => +value) : value
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: "10rem" }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={props.filteredHeights}
          onChange={handleChange}
          input={<OutlinedInput label="height" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {props.options.map((height) => (
            <MenuItem key={height} value={height}>
              <Checkbox checked={props.filteredHeights.indexOf(height) > -1} />
              <ListItemText primary={height} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}