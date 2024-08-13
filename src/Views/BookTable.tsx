
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BookTableCom from '../Components/Reusables/BookTabCom';



const queryClient = new QueryClient();

const BookTable = () => {
  

  return (
    <div style={{  width: "100%", position: "relative", height:'100%'}}>

        {/* top nav */}
        <div style={{width: "100%", height: "40px", background: "white", borderRadius: "10px", marginBottom: "10px", padding: '5px 20px', fontSize: '18px'}}>
          Administrator/Books
        </div>

        <div style={{width: "100%", height: "100%", background: "white", marginBottom: "10px", borderRadius: "10px", overflowY: 'auto',  }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <QueryClientProvider client={queryClient}>
                  <BookTableCom />
              </QueryClientProvider>
            </LocalizationProvider>
            </div>
      </div>
  );
 
  
};

export default BookTable;



 
