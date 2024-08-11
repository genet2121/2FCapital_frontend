
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OwnerTableCom from '../Components/Reusables/OwnerTableCom';
import {  useTheme } from '@mui/material/styles';
import SideBarComponent from '../Components/NavBars/SideBar';
import { useContext } from 'react';
import AlertContext from '../Contexts/AlertContext';
import BookUploadForm from '../Components/Reusables/BookUploadCom';



const queryClient = new QueryClient();

const AvailableBooks = () => {
  
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
    <div style={{ display: "flex", flexDirection: "column", width: "100%", padding: "0 10px", position: "relative", height:'100%' }}>

        {/* top nav */}
        <div style={{width: "100%", height: "40px", background: "white", borderRadius: "10px", marginBottom: "10px", padding: '5px 20px', fontSize: '18px'}}>hey</div>

        <div style={{ width: "100%", overflowY: 'auto'}}>

            <div style={{display: "flex", flexWrap: "wrap", width: "100%", height: "100%", background: "transparent", marginBottom: "10px", borderRadius: "10px", }}>
                <div style={{width: "24%", background: "white", padding: "10px", marginRight: "10px", marginBottom: "10px", borderRadius: "8px"}}>
                    <img src="./images/dertogada_cover.webp" alt="cover" style={{width: "100%", height: "auto", marginBottom: "5px"}}/>
                    <h5 style={{fontSize: "20px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: 0}}>Derto Gada</h5>
                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", marginBottom: "10px"}}>Author: Ysmake Worku</span><br />
                    <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Available: 2 Copies</span><br />
                    <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Price: 200Birr</span><br />
                </div>
                <div style={{width: "24%", background: "white", padding: "10px", marginRight: "10px", marginBottom: "10px", borderRadius: "8px"}}>
                    <img src="./images/dertogada_cover.webp" alt="cover" style={{width: "100%", height: "auto", marginBottom: "5px"}}/>
                    <h5 style={{fontSize: "20px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Derto Gada</h5>
                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Author: Ysmake Worku</span><br />
                    <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Available: 2 Copies</span><br />
                    <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Price: 200Birr</span><br />
                </div>
                <div style={{width: "24%", background: "white", padding: "10px", marginRight: "10px", marginBottom: "10px", borderRadius: "8px"}}>
                    <img src="./images/dertogada_cover.webp" alt="cover" style={{width: "100%", height: "auto", marginBottom: "5px"}}/>
                    <h5 style={{fontSize: "20px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Derto Gada</h5>
                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Author: Ysmake Worku</span><br />
                    <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Available: 2 Copies</span><br />
                    <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Price: 200Birr</span><br />
                </div>
                <div style={{width: "24%", background: "white", padding: "10px", marginBottom: "10px", borderRadius: "8px"}}>
                    <img src="./images/dertogada_cover.webp" alt="cover" style={{width: "100%", height: "auto", marginBottom: "5px"}}/>
                    <h5 style={{fontSize: "20px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Derto Gada</h5>
                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Author: Ysmake Worku</span><br />
                    <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Available: 2 Copies</span><br />
                    <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Price: 200Birr</span><br />
                </div>
                <div style={{width: "24%", background: "white", padding: "10px", marginRight: "10px", marginBottom: "10px", borderRadius: "8px"}}>
                    <img src="./images/dertogada_cover.webp" alt="cover" style={{width: "100%", height: "auto", marginBottom: "5px"}}/>
                    <h5 style={{fontSize: "20px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Derto Gada</h5>
                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Author: Ysmake Worku</span><br />
                    <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Available: 2 Copies</span><br />
                    <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Price: 200Birr</span><br />
                </div>
                <div style={{width: "24%", background: "white", padding: "10px", marginRight: "10px", marginBottom: "10px", borderRadius: "8px"}}>
                    <img src="./images/dertogada_cover.webp" alt="cover" style={{width: "100%", height: "auto", marginBottom: "5px"}}/>
                    <h5 style={{fontSize: "20px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Derto Gada</h5>
                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Author: Ysmake Worku</span><br />
                    <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Available: 2 Copies</span><br />
                    <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px"}}>Price: 200Birr</span><br />
                </div>
            </div>

        </div>
      </div>
  );
 
  
};

export default AvailableBooks;



 
