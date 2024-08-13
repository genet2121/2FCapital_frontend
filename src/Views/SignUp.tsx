
import React, { useContext, useState } from 'react';
import { Box, TextField, Button, Checkbox, FormControlLabel, Link, Typography, Grid } from '@mui/material';
import AlertContext from '../Contexts/AlertContext';
import MainAPI from '../APIs/MainAPI';
import { useNavigate } from 'react-router-dom';


function SignUpPage() {
  const navigate = useNavigate();
  const { setAlert} = useContext(AlertContext);
 
  const [data, setData] = useState({
    name:"",
    email: "",
    password: "",
    c_password: "",
    location: "",
    phone: ""
  });

  const [contract, setContract] = useState(false);

  const onInputChange = (event: any) => {
    setData(dt => ({...dt, [event.target.name]: event.target.value}))
  }

  const onSubmit = async (event: any) => {

   

    try {

      if(data.password != data.c_password) {
        throw new Error("Password does not match!");
      }
      const { c_password, ...dataToSend } = data;

      await MainAPI.createNewNoAuth("user", { ...dataToSend, Status: "true", Approved: "false", type: "owner" });
      
      navigate("/")
      // await MainAPI.createNewNoAuth("user", { ...data, Status: "true", Approved: "false", type: "owner" });

    } catch(error: any) {
      setAlert(error.message, "error");
    }

  }

  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid item xs={12} md={6} sx={{ bgcolor: '#171B36', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
        <img src='images/book.png' alt='book' width={250} height={150}  />
      </Grid>
        
      <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
        <Box sx={{ width: '75%', maxWidth: 400 }}>
          <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <img src='images/bookIcon.png' alt='book' width={30} style={{ marginRight: '10px' }} /> Book Rent
            
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Signup as Owner
            <hr />
          </Typography>
          <TextField label="Name" variant="outlined" name='name' onChange={onInputChange} fullWidth sx={{ mb: 2 }} />          
          <TextField label="Email address" type='email' variant="outlined" name='email' onChange={onInputChange} fullWidth sx={{ mb: 2 }} />          
          <TextField label="Password" type="password" variant="outlined" name='password' onChange={onInputChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Confirm Password" type="password" variant="outlined" fullWidth sx={{ mb: 2 }} name='c_password' onChange={onInputChange} />
          <TextField label="Location" variant="outlined" fullWidth sx={{ mb: 2 }} name='location' onChange={onInputChange} />
          <TextField label="Phone Number" variant="outlined" fullWidth sx={{ mb: 2 }} name='phone' onChange={onInputChange} />
          <FormControlLabel
            control={<Checkbox checked={contract} onChange={() => {setContract(!contract)}} />}
            label="I accept the Terms and Conditions"
            sx={{ mb: 2 }}
          />
          {
            contract ? (
              <Button variant="contained" color="primary" fullWidth sx={{ mb: 2 }} onClick={onSubmit}>
                SIGN UP
              </Button>
            ) : ""
          }
          <Typography variant="body2" align="center">
            Already have an account? <Link href="/">Login</Link>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default SignUpPage;