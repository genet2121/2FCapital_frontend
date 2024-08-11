import * as React from 'react';
import Typography from '@mui/material/Typography';
import TableCom from '../Components/Reusables/TableCom';
import { useContext } from 'react';
import AlertContext from '../Contexts/AlertContext';
import PieChartWithCenterLabel from '../Components/PieChart';
import EarningSummaryChart from '../Components/Reusables/LineGraph';
import SouthIcon from '@mui/icons-material/South';
export default function MiniDrawer() {

  const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);

  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>

        {/* top nav */}
        <div style={{ width: "100%", height: "40px", background: "white", borderRadius: "10px", marginBottom: "10px" }}></div>

        <div style={{ display: "flex", flexDirection: "row", height: "100%", width: "100%", overflow: "hidden" }}>

          {/* inner sidebar */}
          <div style={{ width: "25%", height: "100%", background: "white", borderRadius: "10px", marginRight: "10px", padding: "10px" }}>
            <Typography sx={{ mb: 0, fontSize: 15, color: '#525256' }}>This Month Statistics</Typography>
            <Typography sx={{ mt: 0, mb: 2, fontSize: '10px', color: '##A3A3A3' }}>Tue, 14 Nov, 2024, 11.30 AM </Typography>

            {/* <div style={{width: "100%", height: "auto", borderRadius: "8px", marginBottom: '10px', boxShadow: "0 4px 10px 1px rgb(178, 178, 178)"}}> 
            hey
            </div> */}
            <div style={{ width: "100%", height: "auto", borderRadius: "8px", marginBottom: '20px', boxShadow: "0 4px 10px 1px rgb(178, 178, 178)" }}>
              <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '5px', borderBottom: '1px solid #e0e0e0', }}>
                  <h6 style={{ fontWeight: 'bold', fontSize: '13px', margin: 0 }}>Income</h6>
                  <div style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#f0f0f0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>
                    This Month
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <h2 style={{ fontWeight: 'bold', margin: 0, marginRight: '8px', fontSize: "18px" }}>ETB 9460.00</h2>
                  <span style={{ color: 'red', display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                    <span style={{ fontSize: '16px', marginRight: '4px' }}><SouthIcon sx={{ fontSize: '16px' }} /></span>
                    1.5%
                  </span>
                </div>

                <p style={{ color: '#888888', marginBottom: 0, fontSize: '10px' }}>
                  Compared to ETB9940 last month
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
                  <span style={{ fontWeight: 'bold', color: '#666', fontSize: '10px' }}>Last Month Income</span>
                  <span style={{ fontWeight: 'bold', color: '#333', fontSize: '10px' }}>ETB 25658.00</span>
                </div>
              </div>
            </div>
            <div style={{ width: "100%", height: "auto", borderRadius: "8px", boxShadow: "0 4px 10px 1px rgb(178, 178, 178)" }}>
              <PieChartWithCenterLabel />
            </div>
          </div>

          {/* main content */}
          <div style={{ display: "flex", flexDirection: "column", width: "75%", height: "100%" }}>
            <div style={{ width: "100%", height: "65%", background: "white", marginBottom: "10px", borderRadius: "10px", padding: "10px", overflow: "auto" }}>
              <TableCom />
            </div>
            <div style={{ width: "100%", height: "45%", background: "white",  padding: '10px',  borderRadius: "10px", overflow: "auto" }}>
              <EarningSummaryChart  />
            </div>
          </div>

        </div>
      </div>
  );
}