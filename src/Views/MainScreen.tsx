import * as React from 'react';
import SideBarComponent from '../Components/NavBars/SideBar';
import { useContext } from 'react';
import AlertContext from '../Contexts/AlertContext';
import { Outlet } from 'react-router-dom';
export default function MainScreen() {

  const {  menu } = useContext(AlertContext);

  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: "row", padding: "10px 10px", background: "#F0F2FF", width: "100%", height: "100%" }}>

      <SideBarComponent />

      <div style={{ width: (menu ? "81%" : "100%"), padding: "0 0 0 10px", position: "relative", overflow: "hidden" }}>
          <Outlet />
      </div>
    </div>
  );
}