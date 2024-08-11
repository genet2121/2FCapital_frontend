import { useMemo, useState } from 'react';
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

const Example = () => {
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
      const fetchURL = new URL(
        '/api/data',
        process.env.NODE_ENV === 'production'
          ? 'https://www.material-react-table.com'
          : 'http://localhost:3000',
      );
      

      fetchURL.searchParams.set(
        'start',
        `${pagination.pageIndex * pagination.pageSize}`,
      );
      fetchURL.searchParams.set('size', `${pagination.pageSize}`);
      fetchURL.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      fetchURL.searchParams.set('globalFilter', globalFilter ?? '');
      fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));

      const response = await fetch(fetchURL.href);
      const json = (await response.json()) as BookApiResponse;
      return json;
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
        accessorKey: 'bookNumber',
        header: 'Book no.',
        Cell: ({ cell }) => (
          <div style={{ backgroundColor: '#F3F4F6', padding: '8px', borderRadius: '8px' }}>
            {cell.getValue<string>()}
          </div>
        ),
      },
      {
        accessorKey: 'bookName',
        header: 'Book Name',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ cell }) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                backgroundColor: cell.getValue<string>() === 'Rented' ? '#FF0000' : '#0000FF',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                marginRight: '8px', 
              }}
            />
            <span>{cell.getValue<string>()}</span>
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
        Cell: () => (
          <div>
            <IconButton style={{color: 'black'}}>
              <EditIcon />
            </IconButton>
            <IconButton style={{color: 'red'}}>
              <DeleteIcon />
            </IconButton>
          </div>
        ),
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

export default Example;




// import { useMemo, useState } from 'react';
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
//   type MRT_ColumnDef,
//   type MRT_ColumnFiltersState,
//   type MRT_PaginationState,
//   type MRT_SortingState,
// } from 'material-react-table';
// import { IconButton, Tooltip } from '@mui/material';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import {
//   QueryClient,
//   QueryClientProvider,
//   keepPreviousData,
//   useQuery,
// } from '@tanstack/react-query'; //note: this is TanStack React Query V5
// import React from 'react';

// //Your API response shape will probably be different. Knowing a total row count is important though.
// type UserApiResponse = {
//   data: Array<User>;
//   meta: {
//     totalRowCount: number;
//   };
// };

// type User = {
//   firstName: string;
//   lastName: string;
//   address: string;
//   state: string;
//   phoneNumber: string;
//   lastLogin: Date;
// };

// const Example = () => {
//   //manage our own state for stuff we want to pass to the API
//   const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
//     [],
//   );
//   const [globalFilter, setGlobalFilter] = useState('');
//   const [sorting, setSorting] = useState<MRT_SortingState>([]);
//   const [pagination, setPagination] = useState<MRT_PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   //consider storing this code in a custom hook (i.e useFetchUsers)
//   const {
//     data: { data = [], meta } = {}, //your data and api response will probably be different
//     isError,
//     isRefetching,
//     isLoading,
//     refetch,
//   } = useQuery<UserApiResponse>({
//     queryKey: [
//       'table-data',
//       columnFilters, //refetch when columnFilters changes
//       globalFilter, //refetch when globalFilter changes
//       pagination.pageIndex, //refetch when pagination.pageIndex changes
//       pagination.pageSize, //refetch when pagination.pageSize changes
//       sorting, //refetch when sorting changes
//     ],
//     queryFn: async () => {
//       const fetchURL = new URL(
//         '/api/data',
//         process.env.NODE_ENV === 'production'
//           ? 'https://www.material-react-table.com'
//           : 'http://localhost:3000',
//       );

//       //read our state and pass it to the API as query params
//       fetchURL.searchParams.set(
//         'start',
//         `${pagination.pageIndex * pagination.pageSize}`,
//       );
//       fetchURL.searchParams.set('size', `${pagination.pageSize}`);
//       fetchURL.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
//       fetchURL.searchParams.set('globalFilter', globalFilter ?? '');
//       fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));

//       //use whatever fetch library you want, fetch, axios, etc
//       const response = await fetch(fetchURL.href);
//       const json = (await response.json()) as UserApiResponse;
//       return json;
//     },
//     placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
//   });

//   const columns = useMemo<MRT_ColumnDef<User>[]>(
//     //column definitions...
//     () => [
//       {
//         accessorKey: 'firstName',
//         header: 'First Name',
//       },
//       {
//         accessorKey: 'lastName',
//         header: 'Last Name',
//       },
//       {
//         accessorKey: 'address',
//         header: 'Address',
//       },
//       {
//         accessorKey: 'state',
//         header: 'State',
//       },
//       {
//         accessorKey: 'phoneNumber',
//         header: 'Phone Number',
//       },
//       {
//         accessorFn: (row) => new Date(row.lastLogin),
//         id: 'lastLogin',
//         header: 'Last Login',
//         Cell: ({ cell }) => new Date(cell.getValue<Date>()).toLocaleString(),
//         filterFn: 'greaterThan',
//         filterVariant: 'date',
//         enableGlobalFilter: false,
//       },
//     ],
//     [],
//     //end
//   );

//   const table = useMaterialReactTable({
//     columns,
//     data,
//     initialState: { showColumnFilters: true },
//     manualFiltering: true, //turn off built-in client-side filtering
//     manualPagination: true, //turn off built-in client-side pagination
//     manualSorting: true, //turn off built-in client-side sorting
//     muiToolbarAlertBannerProps: isError
//       ? {
//           color: 'error',
//           children: 'Error loading data',
//         }
//       : undefined,
//     onColumnFiltersChange: setColumnFilters,
//     onGlobalFilterChange: setGlobalFilter,
//     onPaginationChange: setPagination,
//     onSortingChange: setSorting,
//     renderTopToolbarCustomActions: () => (
//       <Tooltip arrow title="Refresh Data">
//         <IconButton onClick={() => refetch()}>
//           <RefreshIcon />
//         </IconButton>
//       </Tooltip>
//     ),
//     rowCount: meta?.totalRowCount ?? 0,
//     state: {
//       columnFilters,
//       globalFilter,
//       isLoading,
//       pagination,
//       showAlertBanner: isError,
//       showProgressBars: isRefetching,
//       sorting,
//     },
//   });

//   return <MaterialReactTable table={table} />;
// };

// export default Example;
