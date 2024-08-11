// import * as React from 'react';
// import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';

// const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
// const xLabels = [
//   'Page A',
//   'Page B',
//   'Page C',
//   'Page D',
//   'Page E',
//   'Page F',
//   'Page G',
// ];

// export default function EarningSummaryChart() {
//     return (
//         <LineChart


//           series={[{ data: uData, label: 'uv', area: true, showMark: false }]}
//           xAxis={[{ scaleType: 'point', data: xLabels }]}
//           sx={{
//             [`& .${lineElementClasses.root}`]: {
//               display: 'none',
//             },
//           }}
//         />
//       );
// }
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
const data = [
  { name: 'May', uv: 700, pv: 600 },
  { name: 'Jun', uv: 600, pv: 700 },
  { name: 'Jul', uv: 800, pv: 600 },
  { name: 'Aug', uv: 600, pv: 800 },
  { name: 'Sep', uv: 900, pv: 700 },
  { name: 'Oct', uv: 500, pv: 500 },
  { name: 'Nov', uv: 600, pv: 200 },
  { name: 'Dec', uv: 300, pv: 500 },
  { name: 'Jan', uv: 500, pv: 200 },
];

export default function EarningSummaryChart() {
  return (
    <div style={{width: "100%", position: "relative"}}>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis dataKey="name" interval={0} tickMargin={10} tickFormatter={(tick) => tick} />

          <YAxis tickFormatter={(value) => `${value / 100}k`} />
          <Tooltip />

          <Legend verticalAlign="top" align='right' height={36} iconType="circle" />
          <Area type="monotone" dataKey="uv" stroke="#1976d2" fill="url(#colorUv)" name="Last 6 months" />
          <Area type="monotone" dataKey="pv" stroke="grey" fill="url(#colorPv)" strokeDasharray="3 3" name="Same period last year" />
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', alignItems: "center", width: "70%", position: "absolute", top: 0, left: 0  }}>
        <div style={{marginRight: "10px"}}>Earning Summary</div>
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['SingleInputDateRangeField']}>
              <DateRangePicker
                slots={{ field: SingleInputDateRangeField }}
                sx={{fontSize: "10px"}}
                name="allowedRange"

              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
}