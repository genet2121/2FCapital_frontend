import * as React from 'react';
import { useContext } from 'react';
import AlertContext from '../Contexts/AlertContext';
import BookUploadForm from '../Components/Reusables/BookUploadCom';

export default function WorkspacePage() {

  const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);

  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", padding: "0 10px 0 0", height: "100%", position: "relative" }}>

        {/* top nav */}
        <div style={{display: "flex", width: "100%", height: "40px", background: "white", borderRadius: "10px", marginBottom: "10px", padding: "5px 2rem"}}>
          <span style={{margin: "auto 0"}}>Administrator/Book Upload</span>
        </div>

        <div style={{background: "white", display: "flex", flexDirection: "row", height: "100%", width: "100%", borderRadius: "10px"}}>

          <BookUploadForm />

        </div>
    </div>
  );
}