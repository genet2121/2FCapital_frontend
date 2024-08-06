
import React from 'react';
import { Box, TextField, Button, Checkbox, FormControlLabel, Link, Typography, Grid } from '@mui/material';

function SignUpPage() {
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
          <TextField label="Email address" variant="outlined" fullWidth sx={{ mb: 2 }} />
          <TextField label="Password" type="password" variant="outlined" fullWidth sx={{ mb: 2 }} />
          <TextField label="Confirm Password" type="password" variant="outlined" fullWidth sx={{ mb: 2 }} />
          <TextField label="Location" variant="outlined" fullWidth sx={{ mb: 2 }} />
          <TextField label="Phone Number" variant="outlined" fullWidth sx={{ mb: 2 }} />
          <FormControlLabel
            control={<Checkbox />}
            label="I accept the Terms and Conditions"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
            SIGN UP
          </Button>
          <Typography variant="body2" align="center">
            Already have an account? <Link href="/login">Login</Link>
          </Typography>
        </Box>
      </Grid>
    </Grid>
    
    );
}

export default SignUpPage;