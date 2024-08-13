import { useContext, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { QueryClient, QueryClientProvider, keepPreviousData, useQuery } from '@tanstack/react-query'; //note: this is TanStack React Query V5
import React from 'react';
import { Chip } from '@mui/material';
import MainAPI from '../../APIs/MainAPI';
import AuthContext from '../../Contexts/AuthContext';
import AlertContext from '../../Contexts/AlertContext';
import { useNavigate } from 'react-router-dom';
import { Can } from "../../Contexts/AbilityContext";
type BookApiResponse = {
  data: Array<Book>;
  meta: {
    totalRowCount: number;
  };
};

type Book = {
  id: number;
  bookNumber: string;
  bookName: string;
  status: 'Rented' | 'Free';
  price: string;
};

const UploadedBookDashbordData = () => {

  const {cookies} = useContext(AuthContext);
  const {setAlert} = useContext(AlertContext);
  const navigate = useNavigate();

  const dummyData: Book[] = [
    { id: 1, bookNumber: 'BK001', bookName: 'The Great Gatsby', status: 'Free', price: '50' },
    { id: 2, bookNumber: 'BK002', bookName: '1984', status: 'Rented', price: '60' },
    { id: 3, bookNumber: 'BK003', bookName: 'To Kill a Mockingbird', status: 'Free', price: '45' },
    { id: 4, bookNumber: 'BK004', bookName: 'Pride and Prejudice', status: 'Rented', price: '55' },
    { id: 5, bookNumber: 'BK005', bookName: 'Moby Dick', status: 'Free', price: '70' },
    { id: 6, bookNumber: 'BK006', bookName: 'The Catcher in the Rye', status: 'Rented', price: '65' },
    { id: 7, bookNumber: 'BK007', bookName: 'War and Peace', status: 'Free', price: '80' },
    { id: 8, bookNumber: 'BK008', bookName: 'Crime and Punishment', status: 'Rented', price: '75' },
    { id: 9, bookNumber: 'BK009', bookName: 'The Odyssey', status: 'Free', price: '85' },
    { id: 10, bookNumber: 'BK010', bookName: 'Madame Bovary', status: 'Rented', price: '90' },
  ];
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
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
  } = useQuery<BookApiResponse>({
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

  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'No.',
        Cell: ({ row }) => String(row.index + 1).padStart(2, '0'),
        size: 10,
      },
      {
        accessorKey: 'book_id',
        header: 'Book no.',
        Cell: ({ cell }) => (
          <div style={{ backgroundColor: '#F3F4F6', padding: '8px', borderRadius: '8px' }}>
            {cell.getValue<string>()}
          </div>
        ),
      },
      {
        accessorKey: 'book.name',
        header: 'Book Name',
      },
      {
        accessorKey: 'quantity',
        header: 'Status',
        Cell: ({ cell }) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                backgroundColor: cell.getValue<string>() === '0' ? '#FF0000' : '#0000FF',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                marginRight: '8px', 
              }}
            />
            <span>{cell.getValue<string>() == '0' ? "Rented" : "Available"}</span>
          </div>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        Cell: ({ cell }) => `${cell.getValue<string>()} Birr`,
      },
      {
        accessorKey: 'actions',
        header: 'Action',

       Cell: ({ cell, row }) => {

        const handleEditClick = async () => {
          navigate(`/new_book?book_upload_id=${row.original.id}`)
           
         };
        
          return(
            <Can I="update" a="bookupload" >
                  <div>
            <IconButton style={{color: 'black'}} onClick={handleEditClick}>
              <EditIcon />
            </IconButton>
            <IconButton style={{color: 'red'}}>
              <DeleteIcon />
            </IconButton>
          </div>
            </Can>
          

          );
       }
      },
    ],
    [],
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

export default UploadedBookDashbordData;

