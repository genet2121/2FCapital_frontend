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
import ViewUser from './ViewUser';
import { props } from '../../APIs/api';
const dummyData: User[] = [];
type UserApiResponse = {
  data: Array<User>;
  meta: {
    totalRowCount: number;
  };
};
type User = {
  id: string;
  name: string;
  email: string;
  location: string;
  status: string;
  action: string;
  password: string;
  phone: string;
  type: string
};
const OwnerTableCom = () => {

  const { cookies } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  // useState<any>({
  //   email: "email",
  //   name: "name",
  //   phone:"phone",
  //   location: "location"
  // });
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

      const response = await MainAPI.getAll(cookies.login_token, "user", 1, 10, { condition, sort });
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

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'No',
        size: 50,
      },
      {
        accessorKey: 'name',
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
        accessorKey: 'bookUploads.length',
        header: 'Uploaded',
      },
      {
        accessorKey: 'location',
        header: 'Location',
      },
      {
        accessorKey: 'Status',
        header: 'Status',
        Cell: ({ cell, row }) => {
          const value = cell.getValue() as string;
          const isChecked = value === 'true';

          const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
            const newStatus = event.target.checked ? 'true' : 'false';

            try {
              await MainAPI.update(cookies.login_token, "user", {
                id: row.original.id,
                Status: newStatus,
                email: row.original.email,
                name: row.original.name,
                password: row.original.password,
                phone: row.original.phone,
                type: row.original.type,
                location: row.original.location
              });


              row.original.status = newStatus;


              refetch();
              // window.location.reload();

            } catch (error: any) {
              setAlert(error.message, "error");
            }
          };

          return (
            <div style={{ display: 'flex', alignItems: 'center', borderRadius: '15px', background: '#0080001A' }}>
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
      },

      {
        accessorKey: 'Approved',
        header: 'Action',
        Cell: ({ cell, row }) => {
          const action = cell.getValue();
          const [open, setOpen] = React.useState(false);

          const [viewRecord, setViewRecord] = useState<any>({ name: '', email: '', location: '', phone: '' });

          const loadData = async (id: number) => {
            try {
              let response = await MainAPI.getSingle(cookies.login_token, "user", id);
              setViewRecord((vr: any) => ({ name: response.name, email: response.email, location: response.location, phone: response.phone }));
            } catch (error: any) {
              setAlert(error.message, "error");
            }
          };

          const handleViewClick = async () => {
            if(viewRecord.name == "") {
              await loadData(parseInt(row.original.id));
            }
            setOpen(true);
          };
          const handleClose = () => {
            setOpen(false);
          };

          const handleDeleteClick = async () => {
            try {
              console.log(`Delete icon clicked for row ID: ${row.original.id}`);
              await MainAPI.delete(cookies.login_token, "user", parseInt(row.original.id));
              refetch();
            } catch (error: any) {
              setAlert(error.message, "error");
            }
          };

          const handleApproveClick = async () => {
            try {
              await MainAPI.update(cookies.login_token, "user", { ...row.original, Approved: "true" });
              refetch();
              // window.location.reload();
            } catch (error: any) {
              setAlert(error.message, "error");
            }
            // console.log(`Approve button clicked for row ID: ${row.original.id}`);

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
                    value={viewRecord.name}
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    label="Email"
                    id="filled-size-normal"
                    value={viewRecord.email}
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    label="Location"
                    id="filled-size-normal"
                    value={viewRecord.location}
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    label="Phone"
                    id="filled-size-normal"
                    value={viewRecord.phone}
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                </DialogContent>
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
