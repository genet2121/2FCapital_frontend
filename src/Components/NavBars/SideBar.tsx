import React, { useContext, useEffect, useState } from "react";
import AlertContext from "../../Contexts/AlertContext";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../Contexts/AuthContext";
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SidebarItem from './SidebarItem';
import Divider from '@mui/material/Divider';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import BookIcon from '@mui/icons-material/Book';
import PersonIcon from '@mui/icons-material/Person';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import QueueIcon from '@mui/icons-material/Queue';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsIcon from '@mui/icons-material/Settings';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Can } from "../../Contexts/AbilityContext";

function SideBarComponent() {

    const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
    const { loggedUser, removeCookie } = useContext(AuthContext);

    // const [navList, setNavList] = useState<INavigation[]>([]);
    const [style, setStyle] = useState({
        display: "flex",
        justifyContent: "space-between",
        transitionDuration: "1s",
        width: "max-content",
        background: "#171B36",
        color: "white",
        boxShadow: "0 0 10px 1px gray",
        borderRadius: "10px",
        overflow: "hidden",
        padding: "10px 15px",
    });

    const navigate = useNavigate();
    // useEffect(() => {
    //     loadData();
    // }, [loggedUser]);

    const toggleSidebar = () => {
        setStyle((st) => ({ ...st, width: (menu ? "max-content" : "19%") }))
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
        <div style={{ ...style, flexDirection: "column" }}>

            <div style={{ width: "100%", height: "max-content" }}>

                <div style={{ display: "flex", alignItems: "center", width: "max-width", height: "max-height", cursor: "pointer" }}>
                    <MenuIcon
                        sx={menu ? { marginRight: "10px", fontSize: "30px" } : { margin: "0 auto", fontSize: "30px" }}
                        onClick={toggleSidebar}
                    />
                    <img src='/images/Sidebar_logo.png' style={{ display: (menu ? "" : "none"), width: "35px", marginRight: "10px" }} />
                    <h6 style={{ display: (menu ? "" : "none"), fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", fontWeight: "normal", fontSize: "17px", margin: 0, color: "#00ABFF" }}>Book Rent</h6>
                </div>
                <Divider sx={{ background: "white", margin: "10px 0" }} />

                    <SidebarItem Icon={SpaceDashboardIcon} open={menu} text={"Dashboard"} method={() => { navigate("/") }} />
                <Can I="read" a="bookupload" >
                    <SidebarItem Icon={BookIcon} open={menu} text={"Books"} method={() => { navigate("/book") }} />
                </Can>
                <SidebarItem Icon={BookIcon} open={menu} text={"Avalable Books"} method={() => { navigate("/available_books") }} />

                <Can I="create" a="bookupload" >
                    <SidebarItem Icon={QueueIcon} open={menu} text={"Book Upload"} method={() => { navigate("/new_book") }} />
                </Can>

                <Can I="read" a="user" >
                    <SidebarItem Icon={PersonIcon} open={menu} text={"Owners"} method={() => { navigate("/owner") }} />
                </Can>
                <Can I="read" a="rent" >
                    <SidebarItem Icon={LibraryBooksIcon} open={menu} text={"Rent List"} method={() => { navigate("/rents") }} />
                </Can>
                <Can I="create" a="rent" >
                    <SidebarItem Icon={PostAddIcon} open={menu} text={"New Rent"} method={() => { navigate("/new_rent") }} />
                </Can>
                <Divider sx={{ background: "white", margin: "10px 0" }} />
                <SidebarItem Icon={NotificationsNoneIcon} open={menu} text={"Notifications"} method={() => { }} />
                <SidebarItem Icon={SettingsIcon} open={menu} text={"Settings"} method={() => { }} />

            </div>

            <button
                style={{
                    display: "flex",
                    justifyContent: "center",
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    alignItems: "center",
                    width: "100%",
                    height: "max-height",
                    borderRadius: "5px",
                    padding: "8px",
                    marginBottom: "5px",
                    transitionDuration: "0.5s",
                    border: "none",
                    cursor: "pointer"
                }}
                onClick={() => {
                    // exitSideBar()
                    removeCookie("login_token");
                    setTimeout(() => {
                        window.location.href = window.location.origin;
                    }, 1500);
                }}
            >
                <LogoutIcon sx={menu ? { marginRight: "10px", fontSize: "17px" } : { marginLeft: "-3px", fontSize: "17px" }} />
                <h6 style={{ display: (menu ? "" : "none"), fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", fontWeight: "normal", fontSize: "14px", margin: 0 }}>Logout</h6>
            </button>

        </div>
    );
}

export default SideBarComponent;