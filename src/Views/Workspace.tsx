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
import BookUploadForm from '../Components/Reusables/BookUploadCom';

export default function WorkspacePage() {

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

        

          {/* main content */}
          <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%"}}>
            <div style={{width: "100%", height: "100%", background: "white", marginBottom: "10px", borderRadius: "10px", }}>
            <BookUploadForm />
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
}