import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

interface SliderProps {
    filteredHeights: number[];
    setFilteredHeights: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function RangeSlider(props: SliderProps) {
  const handleChange = (_: Event, newValue: number | number[]) => {
    console.log(newValue)
    props.setFilteredHeights(newValue as number[]);
  };

  return (
    <Box sx={{ width: "15rem" }}>
      <Slider
        getAriaLabel={() => 'Temperature range'}
        value={props.filteredHeights}
        onChange={handleChange}
        step={500}
        valueLabelDisplay="auto"
        min={0}
        max={10000}
      />
    </Box>
  );
}