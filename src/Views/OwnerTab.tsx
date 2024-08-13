
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

const OwnerTable = () => {
  
  const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);

  return (
    <div style={{  width: "100%", position: "relative", height:'100%'}}>

        {/* top nav */}
        <div style={{width: "100%", height: "40px", background: "white", borderRadius: "10px", marginBottom: "10px", padding: '5px 20px', fontSize: '18px'}}>
          Administrator/Owners
        </div>

        <div style={{ width: "100%", overflowY: 'auto' }}>

            <div style={{width: "100%", height: "100%", background: "white", marginBottom: "10px", borderRadius: "10px", }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <QueryClientProvider client={queryClient}>
                  <OwnerTableCom />
              </QueryClientProvider>
            </LocalizationProvider>
            </div>

        </div>
      </div>
  );
 
  
};

export default OwnerTable;



 
