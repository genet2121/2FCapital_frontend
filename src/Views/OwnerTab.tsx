
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

import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import AuthContext from '../Contexts/AuthContext';


const queryClient = new QueryClient();

const OwnerTable = () => {
  
  
  const { loggedUser } = useContext(AuthContext);

  return (
    <div style={{  width: "100%", position: "relative", height:'100%'}}>

        {/* top nav */}
        <div style={{width: "100%", height: "40px", background: "white", borderRadius: "10px", marginBottom: "10px", padding: '5px 20px', fontSize: '18px'}}>
          <Breadcrumbs aria-label="breadcrumb">
          {
            loggedUser.Roles.includes("admin") ? (
              <Link underline="hover" color="inherit" href="/">
                Administrator
              </Link>
            ) : (
              <Link underline="hover" color="inherit" href="/">
                Owner
              </Link>
            )
          }
        
        <Typography color="text.primary">Owners</Typography>
      </Breadcrumbs>
        </div>

        <div style={{width: "100%", height: "100%", background: "white", marginBottom: "10px", borderRadius: "10px", overflowY: 'auto',  }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <QueryClientProvider client={queryClient}>
                  <OwnerTableCom />
              </QueryClientProvider>
            </LocalizationProvider>
            </div>
      </div>
  );
 
  
};

export default OwnerTable;



 
