import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const data = [
  { value: 54, label: 'Fiction', color: '#007bff' }, 
  { value: 20, label: 'Self Help', color: '#28a745' }, 
  { value: 26, label: 'Business', color: '#dc3545' }, 
];

const size = {
  width: 400,
  height: 160,
};

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

const LegendItem = styled('div')(({ color }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 8,
  color: color,
}));

const LegendCircle = styled('div')(({ color }) => ({
  width: 16,
  height: 16,
  borderRadius: '50%',
  backgroundColor: color,
  marginRight: 8,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  return (
    <StyledText>
      {children}
    </StyledText>
  );
}

export default function PieChartWithCenterLabel() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{width: "100%", padding: 0}}>
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <PieChart
          series={[{
            data: data.map((item) => ({ value: item.value,   color: item.color })),
            innerRadius: 70,
            outerRadius: 100,
           
          }]}
          sx={{ margin: "auto" }}
          {...size}
        >
          
        </PieChart>
      </Box>
      <Box mt={2} >
        {data.map((item) => (
          <LegendItem key={item.label} color={item.color}>
            <LegendCircle color={item.color} />
                <span>{item.label}</span>
            <Box ml="auto">{item.value}</Box>
          </LegendItem>
        ))}
      </Box>
    </Box>
  );
}
