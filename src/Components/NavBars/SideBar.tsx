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

function SideBarComponent() {

    const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
    const { loggedUser, removeCookie } = useContext(AuthContext);

    const [navList, setNavList] = useState<INavigation[]>([]);

    const navigate = useNavigate();
    useEffect(() => {
        loadData();
    }, [loggedUser]);

    const exitSideBar = () => {
        setMenu(false);
    }

    const loadData = () => {
        let temp_navs: INavigation[] = [];
        SideBarNavigation.forEach(async nav => {
            if(nav.active && nav.roles.includes(loggedUser.Roles[0]) && await nav.validator(loggedUser)) {
                temp_navs.push(nav);
            }
        });
        setNavList(temp_navs);
    }


    return (
        <div className="sidebar-overlay" onClick={() => { setTimeout(() => {setMenu(false)}, 50) }}>
            <div className="sidebar-container pt-2 shadow-sm" style={{ width: isMobile ? "70%" : "20%" }}>

                <div className="w-100 pe-2 d-flex justify-content-end">
                    <IconButton onClick={() => { setMenu(false) }} >
                        <ArrowBackIcon />
                    </IconButton>
                </div>
                <div className="d-flex pt-3 justify-content-center">
                    <img src={`/images/main_logo.svg`} alt="image" style={{ width: "150px", height: "auto", }} />
                </div>
                <h5 className="card-title mb-5 text-center" >Nuwa Mobile</h5>

                <div className="list-group list-group-flush">
                    {
                        navList.map((nav) => {
                            if(nav.type == NavigationTypes.LINK) {
                                return (
                                    <Link to={nav.link ?? "/"} className="list-group-item list-group-item-action" onClick={() => {
                                        exitSideBar()
                                    }} >
                                        <nav.Icon /> {nav.Name}
                                    </Link>
                                );
                            }else{
                                return (
                                    <button className="btn list-group-item list-group-item-action" onClick={async () => {
                                        if(nav.action){
                                            await nav.action(loggedUser);
                                        }
                                        exitSideBar()
                                    }} >
                                        <nav.Icon /> {nav.Name}
                                    </button>
                                );
                            }
                        })
                    }
                    <button className="btn list-group-item list-group-item-action" onClick={() => {
                        // exitSideBar()
                        removeCookie("login_token");
                        setTimeout(() => {
                            window.location.href = window.location.origin;
                        }, 1500);
                    }} >
                        <LogoutIcon /> Sign Out
                    </button>
                    
                </div>

            </div>
        </div>
    );
}

export default SideBarComponent;