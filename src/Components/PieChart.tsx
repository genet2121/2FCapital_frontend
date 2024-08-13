import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import MainAPI from '../APIs/MainAPI';
import AlertContext from '../Contexts/AlertContext';
import AuthContext from '../Contexts/AuthContext';

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

  const { setAlert, setWaiting, setMenu, menu } = React.useContext(AlertContext);
  const { cookies } = React.useContext(AuthContext);

  const [bookData, setBookData] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadBookData();
  }, []);

  const loadBookData = async () => {
    let response = await MainAPI.getAll(cookies.login_token, "book", 1, 1000, {});
    let response_categories = await MainAPI.getAll(cookies.login_token, "choice", 1, 1000, {
      condition: {
        type: "book_category",
      }
    });
    let temp_data: any = [];
    let colors: any = {
      fantacy: '#007bff',
      fiction: '#28a745',
      history: '#dc3545'
    }

    response_categories.Items.forEach(cat => {
      temp_data.push({ value: response.Items.filter(bk => bk.category == cat.value).length, label: cat.label, color: colors[cat.value] ?? '#007bff' })
    });

    setBookData(temp_data);

  }
  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{width: "100%", padding: 0}}>
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <PieChart
          series={[{
            data: bookData.map((item) => ({ value: item.value,   color: item.color })),
            innerRadius: 70,
            outerRadius: 100,
           
          }]}
          sx={{ margin: "auto" }}
          {...size}
        >
          
        </PieChart>
      </Box>
      <Box mt={2} >
        {bookData.map((item) => (
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
