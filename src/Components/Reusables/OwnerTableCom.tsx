import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import { IconButton, Tooltip, Switch, Button, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'; 
import React from 'react';
import { useCookies } from 'react-cookie';
import MainAPI from '../../APIs/MainAPI';
const dummyData: User[] = [
  {
    id: '1',
    fullName: 'John Doe',
    uploadedBooks: '10',
    location: 'New York, USA',
    status: 'true',
    action: 'True',
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    uploadedBooks: '5',
    location: 'London, UK',
    status: 'false',
    action: 'false',
  },
  {
    id: '3',
    fullName: 'Michael Johnson',
    uploadedBooks: '7',
    location: 'Sydney, Australia',
    status: 'true',
    action: 'true',
  },
  {
    id: '4',
    fullName: 'Emily Davis',
    uploadedBooks: '12',
    location: 'Toronto, Canada',
    status: 'false',
    action: 'false',
  },
  {
    id: '5',
    fullName: 'Robert Brown',
    uploadedBooks: '20',
    location: 'Berlin, Germany',
    status: 'true',
    action: 'true',
  },
];
type UserApiResponse = {
    data: Array<User>;
    meta: {
      totalRowCount: number;
    };
  };
// Define the User type
type User = {
  id: string;
  fullName: string;
  uploadedBooks: string;
  location: string;
  status: string;
  action: string;
};

const OwnerTableCom = () => {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  // const [user, setUsers] = useState<User[]>([]);
  
  // const [cookies, setCookie] = useCookies(['login_token']);

  // useEffect(() => {
    
  //     fetchOwners();
    
  // }, );

  // const fetchOwners = async () => {
  //   try {
  //     const token = cookies.login_token;
  //     const condition = { type: 'owner' };
  //     const response = await MainAPI.getAll(token, 'user', 1, 10, condition);
  //     setUsers(response.Items);
  //   } catch (error) {
  //     console.error('Error fetching owners:', error);
  //   }
  // };

  // API query to fetch data
 
  const {
    data: { data = [], meta } = {}, //your data and api response will probably be different
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<UserApiResponse>({
    queryKey: [
      'table-data',
      columnFilters, 
      globalFilter, 
      pagination.pageIndex, 
      pagination.pageSize, 
      sorting,
    ],
    queryFn: async () => {
      const fetchURL = new URL(
        'http://localhost:3005/api/crud/getlist/user/' + (pagination.pageIndex + 1) + '/' + pagination.pageSize,
        process.env.NODE_ENV === 'production'
          ? 'https://www.material-react-table.com'
          : 'http://localhost:3000',
      );

      fetchURL.searchParams.set('start', `${pagination.pageIndex * pagination.pageSize}`);
      fetchURL.searchParams.set('size', `${pagination.pageSize}`);
      fetchURL.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      fetchURL.searchParams.set('globalFilter', globalFilter ?? '');
      fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));

      const response = await fetch(fetchURL.href);
      const json = (await response.json()) as UserApiResponse;
      return json;
    },
    
    // placeholderData: keepPreviousData,
    placeholderData: {
      data: dummyData,
      meta: {
        totalRowCount: 5,
      },
    },
  });
 
  const [checked, setChecked] = React.useState(true);

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'No',
        size: 50,
      },
      {
        accessorKey: 'fullName',
        header: 'Owner Name',
        Cell: ({ cell }) => {
          const value = cell.getValue() as string; // Cast to string
      
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="./images/image.png" // Replace with dynamic avatar URLs
                alt="avatar"
                style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 8 }}
              />
              {value}
            </div>
          );
        },
      },
      
      {
        accessorKey: 'uploadedBooks',
        header: 'Uploaded',
      },
      {
        accessorKey: 'location',
        header: 'Location',
      },
     
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ cell }) => {
          const value = cell.getValue() as string;
          const isChecked = value === 'true';
          const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setChecked(event.target.checked);
          };
          return (
            <div style={{ display: 'flex', alignItems: 'center', borderRadius:'15px', background:'#0080001A' }}>
              <CheckCircleIcon
                sx={{
                  color: isChecked ? 'green' : 'grey',
                  marginRight: 1,
                  marginLeft:1
                }}
              />
              <Typography
                sx={{
                  color: isChecked ? 'green' : 'grey',
                  marginRight: 1,
                  fontWeight: 'bold',
                }}
              >
                {isChecked ? 'Active' : 'Inactive'}
              </Typography>
              <Switch
                checked={isChecked}
                onChange={handleChange}
                color="success"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'green',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'green',
                  },
                }}
              />
            </div>
          );
        },
      },
    
      
      
      {
        accessorKey: 'action',
        header: 'Action',
        Cell: ({ cell, row }) => {
          const action = cell.getValue(); 
          const [open, setOpen] = React.useState(false);

          const handleViewClick = () => {
            console.log(`View icon clicked for row ID: ${row.original.id}`);
            setOpen(true);
          };
          const handleClose = () => {
            setOpen(false);
          };
      
          const handleDeleteClick = () => {
            console.log(`Delete icon clicked for row ID: ${row.original.id}`);
           
          };
      
          const handleApproveClick = () => {
            console.log(`Approve button clicked for row ID: ${row.original.id}`);
          
          };
      
          return (
            <div style={{ display: 'flex', gap: 8 }}>
              <IconButton aria-label="view" sx={{ color: "#000000" }} onClick={handleViewClick}>
                <VisibilityIcon />
              </IconButton>
              <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
       
        <DialogContent>
        <TextField
          label="Name"
          id="filled-size-normal"
          defaultValue="Name"
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        />
          <TextField
          label="Email"
          id="filled-size-normal"
          defaultValue="Email"
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        />
         <TextField
          label="Location"
          id="filled-size-normal"
          defaultValue="Location"
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        />
          <TextField
          label="Phone"
          id="filled-size-normal"
          defaultValue="Phone"
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        />
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions> */}
      </Dialog>
              <IconButton aria-label="delete" sx={{ color: '#FF0000' }} onClick={handleDeleteClick}>
                <DeleteIcon />
              </IconButton>
              <Button
                variant="contained"
                color={action === 'true' ? 'inherit' : 'primary'}
                disabled={action === 'true'}
                onClick={handleApproveClick} 
                
              >
                Approve
              </Button>
            </div>
          );
        },
      }
      
      
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    ),
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default OwnerTableCom;
function setData(arg0: (prevData: any) => any) {
  throw new Error('Function not implemented.');
}


// import { useEffect, useMemo, useState } from 'react';
// import {
//   MaterialReactTable,
//   type MRT_ColumnDef,
//   type MRT_ColumnFiltersState,
//   type MRT_PaginationState,
//   type MRT_SortingState,
//   type MRT_TableState,
// } from 'material-react-table';
// import { IconButton, Tooltip, Switch, Button, Typography, Dialog, DialogContent, TextField } from '@mui/material';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import DeleteIcon from '@mui/icons-material/Delete';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import { useQuery } from '@tanstack/react-query';
// import React from 'react';
// import { useCookies } from 'react-cookie';
// import MainAPI from '../../APIs/MainAPI';

// const dummyData: User[] = [
//   // Example data
// ];

// type UserApiResponse = {
//   data: Array<User>;
//   meta: {
//     totalRowCount: number;
//   };
// };

// type User = {
//   id: string;
//   fullName: string;
//   uploadedBooks: string;
//   location: string;
//   status: string;
//   action: string;
// };

// const OwnerTableCom = () => {
//   const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
//   const [globalFilter, setGlobalFilter] = useState('');
//   const [sorting, setSorting] = useState<MRT_SortingState>([]);
//   const [pagination, setPagination] = useState<MRT_PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });
//   const [cookies] = useCookies(['login_token']);

//   const { data = { data: [], meta: { totalRowCount: 0 } }, isError, isRefetching, isLoading, refetch } = useQuery<UserApiResponse>({
//     queryKey: [
//       'table-data',
//       columnFilters,
//       globalFilter,
//       pagination.pageIndex,
//       pagination.pageSize,
//       sorting,
//     ],
//     queryFn: async () => {
//       const token = cookies.login_token;
//       const fetchURL = new URL(
//         'http://localhost:3005/api/crud/getlist/user/' + (pagination.pageIndex + 1) + '/' + pagination.pageSize,
//         // process.env.NODE_ENV === 'production'
//         //   ? 'https://www.material-react-table.com'
//         //   : 'http://localhost:3000',
//       );
    
//       fetchURL.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
//       fetchURL.searchParams.set('globalFilter', globalFilter ?? '');
//       fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));
    
//       console.log('Fetching data from:', fetchURL.href);
    
//       const response = await fetch(fetchURL.href, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
    
//       console.log('Response status:', response.status);
    
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
    
//       const json = await response.json();
    
//       console.log('Response data:', json);
    
//       if (json.Items && json.PageNumber !== undefined && json.TotalCount !== undefined && json.PageSize !== undefined) {
//         return {
//           data: json.Items,
//           meta: {
//             totalRowCount: json.TotalCount,
//           },
//         } as UserApiResponse;
//       } else {
//         throw new Error('Invalid data format');
//       }
//     },
//     placeholderData: {
//       data: dummyData,
//       meta: {
//         totalRowCount: 5,
//       },
//     },
//   });

//   const columns = useMemo<MRT_ColumnDef<User>[]>(
//     () => [
//       {
//         accessorKey: 'id',
//         header: 'No',
//         size: 50,
//       },
//       {
//         accessorKey: 'fullName',
//         header: 'Owner Name',
//         Cell: ({ cell }) => {
//           const value = cell.getValue() as string;
//           return (
//             <div style={{ display: 'flex', alignItems: 'center' }}>
//               <img
//                 src="./images/image.png"
//                 alt="avatar"
//                 style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 8 }}
//               />
//               {value}
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: 'uploadedBooks',
//         header: 'Uploaded',
//       },
//       {
//         accessorKey: 'location',
//         header: 'Location',
//       },
//       {
//         accessorKey: 'status',
//         header: 'Status',
//         Cell: ({ cell }) => {
//           const value = cell.getValue() as string;
//           const isChecked = value === 'true';
//           const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//             // Handle status changes
//           };
//           return (
//             <div style={{ display: 'flex', alignItems: 'center', borderRadius:'15px', background:'#0080001A' }}>
//               <CheckCircleIcon
//                 sx={{
//                   color: isChecked ? 'green' : 'grey',
//                   marginRight: 1,
//                   marginLeft:1
//                 }}
//               />
//               <Typography
//                 sx={{
//                   color: isChecked ? 'green' : 'grey',
//                   marginRight: 1,
//                   fontWeight: 'bold',
//                 }}
//               >
//                 {isChecked ? 'Active' : 'Inactive'}
//               </Typography>
//               <Switch
//                 checked={isChecked}
//                 onChange={handleChange}
//                 color="success"
//                 sx={{
//                   '& .MuiSwitch-switchBase.Mui-checked': {
//                     color: 'green',
//                   },
//                   '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
//                     backgroundColor: 'green',
//                   },
//                 }}
//               />
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: 'action',
//         header: 'Action',
//         Cell: ({ cell, row }) => {
//           const action = cell.getValue() as string; 
//           const [open, setOpen] = React.useState(false);

//           const handleViewClick = () => {
//             console.log(`View icon clicked for row ID: ${row.original.id}`);
//             setOpen(true);
//           };

//           const handleClose = () => {
//             setOpen(false);
//           };
      
//           const handleDeleteClick = () => {
//             console.log(`Delete icon clicked for row ID: ${row.original.id}`);
//           };
      
//           const handleApproveClick = () => {
//             console.log(`Approve button clicked for row ID: ${row.original.id}`);
//           };

//           return (
//             <div style={{ display: 'flex', gap: 8 }}>
//               <IconButton aria-label="view" sx={{ color: "#000000" }} onClick={handleViewClick}>
//                 <VisibilityIcon />
//               </IconButton>
//               <Dialog
//                 open={open}
//                 onClose={handleClose}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//               >
//                 <DialogContent>
//                   <TextField
//                     label="Name"
//                     id="filled-size-normal"
//                     defaultValue="Name"
//                     variant="outlined"
//                     fullWidth
//                     sx={{ mt: 2 }}
//                   />
//                   <TextField
//                     label="Email"
//                     id="filled-size-normal"
//                     defaultValue="Email"
//                     variant="outlined"
//                     fullWidth
//                     sx={{ mt: 2 }}
//                   />
//                   <TextField
//                     label="Location"
//                     id="filled-size-normal"
//                     defaultValue="Location"
//                     variant="outlined"
//                     fullWidth
//                     sx={{ mt: 2 }}
//                   />
//                   <TextField
//                     label="Phone"
//                     id="filled-size-normal"
//                     defaultValue="Phone"
//                     variant="outlined"
//                     fullWidth
//                     sx={{ mt: 2 }}
//                   />
//                 </DialogContent>
//               </Dialog>
//               <IconButton aria-label="delete" sx={{ color: '#FF0000' }} onClick={handleDeleteClick}>
//                 <DeleteIcon />
//               </IconButton>
//               <Button
//                 variant="contained"
//                 color={action === 'true' ? 'inherit' : 'primary'}
//                 disabled={action === 'true'}
//                 onClick={handleApproveClick}
//               >
//                 Approve
//               </Button>
//             </div>
//           );
//         },
//       },
//     ],
//     []
//   );

//   const tableState: Partial<MRT_TableState<User>> = {
//     columnFilters,
//     globalFilter,
//     pagination,
//     sorting,
//   };

//   useEffect(() => {
//     refetch();
//   }, [refetch]);

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Error loading data...</p>;

//   return (
//     <div>
//       <MaterialReactTable
//         columns={columns}
//         data={data.data}
//         manualFiltering
//         manualPagination
//         manualSorting
//         onColumnFiltersChange={setColumnFilters}
//         onGlobalFilterChange={setGlobalFilter}
//         onPaginationChange={setPagination}
//         onSortingChange={setSorting}
//         state={tableState} // Corrected type assignment
//         renderTopToolbarCustomActions={() => (
//           <Tooltip arrow title="Refresh Data">
//             <IconButton color="primary" onClick={() => refetch()}>
//               <RefreshIcon />
//             </IconButton>
//           </Tooltip>
//         )}
//       />
//     </div>
//   );
// };

// export default OwnerTableCom;
