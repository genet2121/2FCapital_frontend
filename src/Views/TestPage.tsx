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

      <div style={{ display: "flex", flexDirection: "column", width: (menu ? "81%" : "100%"), padding: "0 10px", position: "relative" }}>

        {/* top nav */}
        <div style={{width: "100%", height: "40px", background: "white", borderRadius: "10px", marginBottom: "10px"}}></div>

        <div style={{display: "flex", flexDirection: "row", height: "100%", width: "100%"}}>

          {/* inner sidebar */}
          <div style={{width: "25%", height: "100%", background: "white", borderRadius: "10px", marginRight: "10px"}}></div>

          {/* main content */}
          <div style={{display: "flex", flexDirection: "column", width: "75%", height: "100%"}}>
            <div style={{width: "100%", height: "65%", background: "white", marginBottom: "10px", borderRadius: "10px", padding: "10px", overflow: "auto"}}>
              <TableCom />
            </div>
            <div style={{width: "100%", height: "45%", background: "white", marginBottom: "10px", borderRadius: "10px"}}></div>
          </div>

        </div>
      </div>
    </div>
  );
}