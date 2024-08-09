
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OwnerTableCom from '../Components/Reusables/OwnerTableCom';

const queryClient = new QueryClient();

const OwnerTable = () => (
  //App.tsx or AppProviders file
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <QueryClientProvider client={queryClient}>
        <OwnerTableCom />
    </QueryClientProvider>
  </LocalizationProvider>
);

export default OwnerTable;
