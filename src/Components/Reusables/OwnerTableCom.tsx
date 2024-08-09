import { useMemo, useState } from 'react';
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
        '/api/data',
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
