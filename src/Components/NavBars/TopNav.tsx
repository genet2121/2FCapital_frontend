import { Avatar, IconButton } from "@mui/material";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import AlertContext from "../../Contexts/AlertContext";
import AuthContext from "../../Contexts/AuthContext";

function TopNav() {

    const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
    const { loggedUser, authWaiting } = useContext(AuthContext);

    const navigate = useNavigate();

    function stringToColor(name: string) {
        let hash = 0;
        let i;
        /* eslint-disable no-bitwise */
        for (i = 0; i < name.length; i += 1) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    function stringAvatar(name: string) {
        let slt = name.split(' ');
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${(slt.length > 1) ? (slt[slt.length - 1][0]) : ""}`,
        };
    }


    return authWaiting ? (<></>) : (
        <div className="d-flex justify-content-between p-2 bg-white border-bottom top-nav" style={{ flexWrap: "wrap" }}>
            <div className="">
                <IconButton onClick={() => { window.history.back(); }} >
                    <ArrowBackIcon sx={{fontSize: 40}} />
                </IconButton>
                <IconButton onClick={() => { setMenu(true) }} >
                    <MenuIcon sx={{fontSize: 40}} />
                </IconButton>
            </div>
            <div className="">
                <IconButton onClick={() => { }} >
                    <Avatar {...stringAvatar(loggedUser.FullName ?? "Default")} sx={{width: 40, height: 40, fontSize: 20}} />
                </IconButton>
            </div>
        </div>
    );
}

export default TopNav;