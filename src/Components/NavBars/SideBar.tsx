import React, { useContext, useEffect, useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from "@mui/material";
import { isMobile } from "react-device-detect";
import AlertContext from "../../Contexts/AlertContext";
import { Link, useNavigate } from "react-router-dom";
import INavigation from "../../Intefaces/INavigation";
import SideBarNavigation from "../../Views/SideBarNavigation";
import AuthContext from "../../Contexts/AuthContext";
import NavigationTypes from "../../Enums/NavigationTypes";
import LogoutIcon from '@mui/icons-material/Logout';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import SidebarItem from './SidebarItem';
import Divider from '@mui/material/Divider';

function SideBarComponent() {

    const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
    const { loggedUser, removeCookie } = useContext(AuthContext);

    // const [navList, setNavList] = useState<INavigation[]>([]);
    const [style, setStyle] = useState({
        transitionDuration: "1s",
        width: "max-content",
        background: "#171B36",
        color: "white",
        boxShadow: "0 0 10px 1px gray",
        borderRadius: "10px",
        overflow: "hidden",
        padding: "10px 15px"
    });

    const navigate = useNavigate();
    // useEffect(() => {
    //     loadData();
    // }, [loggedUser]);

    const toggleSidebar = () => {
        setStyle((st) => ({...st, width: (menu ? "max-content" : "20%")}))
        setMenu(!menu);
    }

    // const loadData = () => {
    //     let temp_navs: INavigation[] = [];
    //     SideBarNavigation.forEach(async nav => {
    //         if(nav.active && nav.roles.includes(loggedUser.Roles[0]) && await nav.validator(loggedUser)) {
    //             temp_navs.push(nav);
    //         }
    //     });
    //     setNavList(temp_navs);
    // }


    return (
        <div style={style}>

            <div style={{ display: "flex", alignItems: "center", width: "max-width", height: "max-height", cursor: "pointer" }}>
                <MenuIcon
                    sx={menu ? { marginRight: "10px", fontSize: "30px" } : { margin: "0 auto", fontSize: "30px" }}
                    onClick={toggleSidebar}
                />
                <img src='/images/Sidebar_logo.png' style={{display: (menu ? "" : "none"), width: "35px", marginRight: "10px"}} />
                <h6 style={{display: (menu ? "" : "none"), fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", fontWeight: "normal", fontSize: "17px", margin: 0, color: "#00ABFF" }}>Book Rent</h6>
            </div>
            <Divider sx={{background: "white", margin: "10px 0"}} />

            <SidebarItem Icon={MailIcon} open={menu} text={"new button"} method={() => {}} />
            <SidebarItem Icon={MailIcon} open={menu} text={"Inbox"} method={() => {}} />
            <SidebarItem Icon={MailIcon} open={menu} text={"Outbox"} method={() => {}} />

        </div>
        // <div className="sidebar-overlay" onClick={() => { setTimeout(() => {setMenu(false)}, 50) }}>
        //     <div className="sidebar-container pt-2 shadow-sm" style={{ width: isMobile ? "70%" : "20%" }}>

        //         <div className="w-100 pe-2 d-flex justify-content-end">
        //             <IconButton onClick={() => { setMenu(false) }} >
        //                 <ArrowBackIcon />
        //             </IconButton>
        //         </div>
        //         <div className="d-flex pt-3 justify-content-center">
        //             <img src={`/images/main_logo.svg`} alt="image" style={{ width: "150px", height: "auto", }} />
        //         </div>
        //         <h5 className="card-title mb-5 text-center" >Nuwa Mobile</h5>

        //         <div className="list-group list-group-flush">
        //             {
        //                 navList.map((nav) => {
        //                     if(nav.type == NavigationTypes.LINK) {
        //                         return (
        //                             <Link to={nav.link ?? "/"} className="list-group-item list-group-item-action" onClick={() => {
        //                                 exitSideBar()
        //                             }} >
        //                                 <nav.Icon /> {nav.Name}
        //                             </Link>
        //                         );
        //                     }else{
        //                         return (
        //                             <button className="btn list-group-item list-group-item-action" onClick={async () => {
        //                                 if(nav.action){
        //                                     await nav.action(loggedUser);
        //                                 }
        //                                 exitSideBar()
        //                             }} >
        //                                 <nav.Icon /> {nav.Name}
        //                             </button>
        //                         );
        //                     }
        //                 })
        //             }
        //             <button className="btn list-group-item list-group-item-action" onClick={() => {
        //                 // exitSideBar()
        //                 removeCookie("login_token");
        //                 setTimeout(() => {
        //                     window.location.href = window.location.origin;
        //                 }, 1500);
        //             }} >
        //                 <LogoutIcon /> Sign Out
        //             </button>
                    
        //         </div>

        //     </div>
        // </div>
    );
}

export default SideBarComponent;