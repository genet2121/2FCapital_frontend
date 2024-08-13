
import { useContext, useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import {Tooltip, Typography, Dialog, DialogContent, TextField, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

import EditIcon from '@mui/icons-material/Edit';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {

  useQuery,
} from '@tanstack/react-query';
import React from 'react';
import MainAPI from '../../APIs/MainAPI';
import AuthContext from '../../Contexts/AuthContext';
import AlertContext from '../../Contexts/AlertContext';
import { useNavigate } from 'react-router-dom';
const dummyData: Book[] = [];
type UserApiResponse = {
    data: Array<Book>;
    meta: {
      totalRowCount: number;
    };
  };

type Book = {
  id: string;
  owner: string;
  category: string;
  Status: string;
  bookName: string;
  quantity: number;
  price: number;
  book_id: number;
  book_cover: number;
  additionalAnswer: any[];
  owner_id: number;
};

const RenTableCom = () => {

  const {cookies} = useContext(AuthContext);
  const {setAlert} = useContext(AlertContext);

  const navigate = useNavigate();
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [viewRecord, setViewRecord] = useState<any>({
    email: "email",
    name: "name",
    phone:"phone",
    location: "location"
  });
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
 
  const {
    data: { data = [], meta } = {},
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
      
      let condition: any = {};
      let sort: any = {};

      columnFilters.forEach(cf => {
        condition[cf.id] = { contains: cf.value };
      });

      sorting.forEach(srt => {
        sort[srt.id] = (srt.desc ? "desc" : "asc");
      });

      const response = await MainAPI.getAll(cookies.login_token, "rent", 1, 10, {condition, sort});
      return {
        data: response.Items,
        meta: {
          totalRowCount: response.TotalCount
        }
      };
    },
  
    placeholderData: {
      data: dummyData,
      meta: {
        totalRowCount: 5,
      },
    },
  });
 
  const [checked, setChecked] = React.useState(true);


  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'No',
        size: 20,
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        size: 20,
      },
      {
        accessorKey: 'owner.name',
        header: 'Owner Name',
        Cell: ({ cell }) => {
          const value = cell.getValue() as string; 
      
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="./images/image.png" 
                alt="avatar"
                style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 8 }}
              />
              {value}
            </div>
          );
        },
      },
      
      {
        accessorKey: 'bookUploads.book.category',
        header: 'category',
      },
      {
        accessorKey: 'bookUploads.book.name',
        header: 'Book Name',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ cell, row }) => {
          const value = cell.getValue() as string;
          const isReturned = value === 'returned';
          
      
          return (
            <div style={{ display: 'flex', alignItems: 'center', borderRadius: '15px', background: isReturned ? '#0080001A' : '#FFA5001A', padding: '5px 10px' }}>
              <CheckCircleIcon
                sx={{
                  color: isReturned ? 'green' : 'grey',
                  marginRight: 1,
                  marginLeft: 1,
                }}
              />
              <Typography
                sx={{
                  color: isReturned ? 'green' : 'orange',
                  fontWeight: 'bold',
                }}
              >
                {isReturned ? 'Returned' : 'Rented'}
              </Typography>
            </div>
          );
        },
      },
      {
        accessorKey: 'actions',
        header: 'Action',
        Cell: ({ cell, row }) => {
            const action = cell.getValue();
            const [open, setOpen] = React.useState(false);
  
          
  
            const handleEditClick = async () => {
             navigate(`/new_rent?rent_id=${row.original.id}`)
              
            };
           
  
          

            return(
                <div>
                <IconButton style={{color: 'black'}}  onClick={handleEditClick}>
                  <EditIcon />
                </IconButton>
               
              </div>
            );
           
        }
      
      },
      
    
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

export default RenTableCom;
function setData(arg0: (prevData: any) => any) {
  throw new Error('Function not implemented.');
}
