import React, { useContext, useEffect, useState } from "react";
import { IconButton, Tooltip, Switch, Button, Typography, Dialog, DialogContent, TextField } from '@mui/material';
import MainAPI from "../../APIs/MainAPI";
import AlertContext from "../../Contexts/AlertContext";
import AuthContext from "../../Contexts/AuthContext";

function ViewUser(props: any) {

    const { cookies } = useContext(AuthContext);
    const { setAlert } = useContext(AlertContext);

    const [viewRecord, setViewRecord] = useState({ name: '', email: '', location: '', phone: '' });

    useEffect(() => {
        loadData(props.id);
    }, [props]);

    const loadData = async (id: number) => {
        try {
            let response = await MainAPI.getSingle(cookies.login_token, "user", id);
            setViewRecord((vr: any) => ({ name: response.name, email: response.email, location: response.location, phone: response.phone }));
        } catch (error: any) {
            setAlert(error.message, "error");
        }
    };

    return (
        ""
    )
}

export default ViewUser;