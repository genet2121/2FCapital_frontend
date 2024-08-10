import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import SidebarItem from '../Components/NavBars/SidebarItem';
import SideBarComponent from '../Components/NavBars/SideBar';
import TableCom from '../Components/Reusables/TableCom';
import { useContext } from 'react';
import AlertContext from '../Contexts/AlertContext';
import PieChartWithCenterLabel from '../Components/PieChart';
import BasicArea from '../Components/Reusables/LineGraph';
import EarningSummaryChart from '../Components/Reusables/LineGraph';
import SouthIcon from '@mui/icons-material/South';
export default function MiniDrawer() {

  const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const eyuberegna = () => {
    setOpen(!open);
  }

  return (
    <div style={{ display: 'flex', flexDirection: "row", padding: "10px 10px", background: "#F0F2FF", width: "100%", height: "100%" }}>

      <SideBarComponent />

      <div style={{ display: "flex", flexDirection: "column", width: (menu ? "81%" : "100%"), padding: "0 10px", position: "relative", overflow: "hidden" }}>

        {/* top nav */}
        <div style={{width: "100%", height: "40px", background: "white", borderRadius: "10px", marginBottom: "10px"}}></div>

        <div style={{display: "flex", flexDirection: "row", height: "100%", width: "100%", overflow: "hidden"}}>

          {/* inner sidebar */}
          <div style={{width: "25%", height: "100%", background: "white", borderRadius: "10px", marginRight: "10px", padding: "10px"}}>
            <Typography sx={{mt: 2,  fontSize:20, color:'#525256'}}>This Month Statistics</Typography>
            <Typography sx={{mt: 2, mb:2, fontSize:'12px',  color:'##A3A3A3'}}>Tue, 14 Nov, 2024, 11.30 AM </Typography>

          {/* <div style={{width: "100%", height: "auto", borderRadius: "8px", marginBottom: '10px', boxShadow: "0 4px 10px 1px rgb(178, 178, 178)"}}> 
            hey
            </div> */}
            <div style={{width: "100%", height: "auto", borderRadius: "8px", marginBottom: '10px', boxShadow: "0 4px 10px 1px rgb(178, 178, 178)"}}> 
      <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding:'5px', borderBottom: '1px solid #e0e0e0',  }}>
          <h6 style={{ fontWeight: 'bold', fontSize: '16px',  margin: 0 }}>Income</h6>
          <div style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#f0f0f0', fontSize: '0.875rem', fontWeight: 'bold', color: '#666' }}>
            This Month
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <h2 style={{ fontWeight: 'bold',  margin: 0, marginRight: '8px' }}>ETB 9460.00</h2>
          <span style={{ color: 'red', display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
            <span style={{ fontSize: '16px', marginRight: '4px' }}><SouthIcon sx={{fontSize:'16px'}}/></span>
            1.5%
          </span>
        </div>

        <p style={{ color: '#888888', marginBottom: '12px', fontSize: '0.875rem' }}>
          Compared to ETB9940 last month
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px' }}>
          <span style={{ fontWeight: 'bold', color: '#666', fontSize: '0.875rem' }}>Last Month Income</span>
          <span style={{ fontWeight: 'bold', color: '#333', fontSize: '0.875rem' }}>ETB 25658.00</span>
        </div>
      </div>
    </div>
           <div style={{width: "100%", height: "auto", borderRadius: "8px", boxShadow: "0 4px 10px 1px rgb(178, 178, 178)"}}> 
            <PieChartWithCenterLabel  />
            </div>
          </div>

          {/* main content */}
          <div style={{display: "flex", flexDirection: "column", width: "75%", height: "100%"}}>
            <div style={{width: "100%", height: "65%", background: "white", marginBottom: "10px", borderRadius: "10px", padding: "10px", overflow: "auto"}}>
              <TableCom />
            </div>
            <div style={{width: "100%", height: "45%", background: "white", marginBottom: "10px", padding: '10px',  borderRadius: "10px"}}>
              <EarningSummaryChart />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}