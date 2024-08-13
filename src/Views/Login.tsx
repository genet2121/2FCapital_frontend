import React, { useContext, useEffect, useState } from "react";
import AlertContext from "../Contexts/AlertContext";
import { useNavigate } from "react-router-dom";
import { Login } from "../APIs/AuthAPI";
import AuthContext from "../Contexts/AuthContext";
import Authorization from "../Models/Authorization";
import {  TextField, Button, Checkbox, FormControlLabel, Link, Typography, Grid } from '@mui/material';
function LoginPage() {

    const { setAlert, setWaiting} = useContext(AlertContext);
    const { setLoggedUser, setLoggedIn, setCookie, setAbility } = useContext(AuthContext);

    const [fields, setFields] = useState<{ Email: string, Password: string }>({
        Email: "",
        Password: ""
    });

    const style = {
        mobile: {
            width: "100%",
            // height: "100%"
        },
        desktop: {
            width: "35%"
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
    }, []);

    const fieldSetter = (type: ("Email" | "Password"), value: any) => {
        setFields({ ...fields, [type]: value });
    }

    const submitForm = async (event: any) => {
        event.preventDefault();

        setTimeout(() => { setWaiting(true) }, 1);
        try {
            let response = await Login(fields.Email, fields.Password);
            setLoggedUser(response);
            setCookie("login_token", response.Token, { path: "/", maxAge: 86400 });
            setLoggedIn(true);
            setTimeout(() => {window.location.reload();}, 100)
            setAbility(Authorization(response.data));
            setWaiting(false);
        
            navigate("/");
        } catch (error: any) {
            setWaiting(false);
            setAlert(error.message, "error");
        }

    }

    return (
        <Grid container sx={{ height: '100vh' }}>
        <Grid item xs={12} md={6} sx={{ bgcolor: '#171B36', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
          <img src='images/book.png' alt='book' width={250} height={150}  />
        </Grid>
          
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
          <form style={{ width: '75%', maxWidth: 400 }} onSubmit={submitForm}>
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <img src='images/bookIcon.png' alt='book' width={30} style={{ marginRight: '10px' }} /> Book Rent
              
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
            Login
              <hr />
            </Typography>
            <TextField label="Email address" variant="outlined" fullWidth sx={{ mb: 2 }} onChange={(event: any) => {fieldSetter("Email", event.target.value);}}/>
            <TextField label="Password" type="password" variant="outlined" fullWidth sx={{ mb: 2 }} onChange={(event: any) => {fieldSetter("Password", event.target.value);}} />
            <FormControlLabel
              control={<Checkbox />}
              label="Remember me"
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" fullWidth sx={{ mb: 2 }} type="submit">
            Login
            </Button>
            <Typography variant="body2" align="center">
            Haven not an account? <Link href="/signup">Sign up</Link>
            </Typography>
          </form>
        </Grid>
      </Grid>
    );
}

export default LoginPage;