
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UploadedBookDashbordData from './UploadedBookDashbordData';

const queryClient = new QueryClient();

const Tablecom = () => (
  
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <QueryClientProvider client={queryClient}>
        <UploadedBookDashbordData />
    </QueryClientProvider>
  </LocalizationProvider>
);

export default Tablecom;
