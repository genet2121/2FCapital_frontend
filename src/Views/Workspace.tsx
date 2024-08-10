import * as React from 'react';
import {  useTheme } from '@mui/material/styles';
import SideBarComponent from '../Components/NavBars/SideBar';
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