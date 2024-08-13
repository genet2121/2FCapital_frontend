import * as React from 'react';
import { useContext } from 'react';
import AlertContext from '../Contexts/AlertContext';
import BookUploadForm from '../Components/Reusables/BookUploadCom';
import AuthContext from '../Contexts/AuthContext';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
export default function WorkspacePage() {

  const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);

  const [open, setOpen] = React.useState(false);
  const { loggedUser } = useContext(AuthContext);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", padding: "0 10px 0 0", height: "100%", position: "relative" }}>

        {/* top nav */}
        <div style={{display: "flex", width: "100%", height: "40px", background: "white", borderRadius: "10px", marginBottom: "10px", padding: "5px 2rem"}}>
          <span style={{margin: "auto 0"}}>
          <Breadcrumbs aria-label="breadcrumb">
          {
            loggedUser.Roles.includes("admin") ? (
              <Link underline="hover" color="inherit" href="/">
                Administrator
              </Link>
            ) : (
              <Link underline="hover" color="inherit" href="/">
                Owner
              </Link>
            )
          }
        
        <Typography color="text.primary">Book Upload</Typography>
      </Breadcrumbs>
          </span>
        </div>

        <div style={{background: "white", display: "flex", flexDirection: "row", height: "100%", width: "100%", borderRadius: "10px"}}>

          <BookUploadForm />

        </div>
    </div>
  );
}