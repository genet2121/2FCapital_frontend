
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BookTableCom from '../Components/Reusables/BookTabCom';
import RenTableCom from '../Components/Reusables/RentTabCom';



const queryClient = new QueryClient();

const RentTable = () => {
  

  return (
    <div style={{  width: "100%", position: "relative", height:'100%'}}>

        {/* top nav */}
        <div style={{width: "100%", height: "40px", background: "white", borderRadius: "10px", marginBottom: "10px", padding: '5px 20px', fontSize: '18px'}}>
          Administrator/Rents
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



 
