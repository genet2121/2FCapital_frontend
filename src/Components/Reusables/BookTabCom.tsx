import { useContext, useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import { IconButton, Tooltip, Switch, Button, Typography, Dialog, DialogContent, TextField } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {

  useQuery,
} from '@tanstack/react-query';
import React from 'react';
import MainAPI from '../../APIs/MainAPI';
import AuthContext from '../../Contexts/AuthContext';
import AlertContext from '../../Contexts/AlertContext';
const dummyData: Book[] = [];
type UserApiResponse = {
    data: Array<Book>;
    meta: {
      totalRowCount: number;
    };
  };

type Book = {
  id: string;
  author: string;
  owner: string;
  category: string;
  Status: string;
  bookName: string;
  quantity: number;
  price: number;
  book_id: number;
  book_cover: number;
  questionaries: any[];
  owner_id: number;
};

const BookTableCom = () => {

  const {cookies} = useContext(AuthContext);
  const {setAlert} = useContext(AlertContext);

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

      const response = await MainAPI.getAll(cookies.login_token, "bookupload", 1, 10, {condition, sort});
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
        size: 50,
      },
      {
        accessorKey: 'book.author',
        header: 'Author',
     
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
        accessorKey: 'book.category',
        header: 'category',
      },
      {
        accessorKey: 'book.name',
        header: 'Book Name',
      },
     
    
    {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ cell, row }) => {
          const value = cell.getValue() as string;
          const isChecked = value === 'true';
          console.log(row.original)
          const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
            const newStatus = event.target.checked ? 'true' : 'false';
            try {
              await MainAPI.update(cookies.login_token, "bookupload", {
                id: row.original.id,
                status: newStatus,
                quantity: row.original.quantity,
                price: row.original.price,
                book_id: row.original.book_id,
                book_cover: row.original.book_cover,
                questionaries: row.original.questionaries,
                owner_id: row.original.owner_id
              });
      
             
              row.original.Status  = newStatus;
      
              
              refetch();
                // window.location.reload();
              
            } catch (error: any) {
              setAlert(error.message, "error");
            }
          };
      
          return (
            <div style={{ display: 'flex', alignItems: 'center', borderRadius:'15px', background:'#0080001A' }}>
              <CheckCircleIcon
                sx={{
                  color: isChecked ? 'green' : 'grey',
                  marginRight: 1,
                  marginLeft: 1,
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

export default BookTableCom;
function setData(arg0: (prevData: any) => any) {
  throw new Error('Function not implemented.');
}
