// [
//     {
//       accessorKey: 'name.firstName', //access nested data with dot notation
//       header: 'First Name',
//       size: 150,
//     },
//     {
//       accessorKey: 'name.lastName',
//       header: 'Last Name',
//       size: 150,
//     },
//     {
//       accessorKey: 'address', //normal accessorKey
//       header: 'Address',
//       size: 200,
//     },
//     {
//       accessorKey: 'city',
//       header: 'City',
//       size: 150,
//     },
//     {
//       accessorKey: 'state',
//       header: 'State',
//       size: 150,
//     },
//   ]

//Date Picker Imports - these should just be in your Context Provider
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';
import Example from './Example';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const ExampleWithLocalizationProvider = () => (
  //App.tsx or AppProviders file
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <QueryClientProvider client={queryClient}>
        <Example />
    </QueryClientProvider>
  </LocalizationProvider>
);

export default ExampleWithLocalizationProvider;
