
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useContext } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RenTableCom from '../Components/Reusables/RentTabCom';
import AuthContext from '../Contexts/AuthContext';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';


const queryClient = new QueryClient();

const RentTable = () => {
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
        
        <Typography color="text.primary">Rents</Typography>
      </Breadcrumbs>
        </div>

        <div style={{width: "100%", height: "100%", background: "white", marginBottom: "10px", borderRadius: "10px", overflowY: 'auto',  }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <QueryClientProvider client={queryClient}>
                  <RenTableCom />
              </QueryClientProvider>
            </LocalizationProvider>
            </div>
      </div>
  );
 
  
};

export default RentTable;



 
