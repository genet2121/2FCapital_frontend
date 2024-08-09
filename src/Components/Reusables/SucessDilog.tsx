import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';

const SuccessDialog = () => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs">
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          px: 4,
          py: 6,
        }}
      >
        <Box sx={{ fontSize: 70, color: '#00ABFF' }}>
          {/* <SentimentSatisfiedAltOutlinedIcon fontSize="inherit" /> */}
          <img src='./images/bg.png' alt='imf' height={134} width={150}/>
        </Box>
        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
          Congrats!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          You have uploaded the book successfully. Wait until we approve it.
        </Typography>
        <Button
          variant="contained"
          onClick={handleClose}
          sx={{
            width: '100%',
            bgcolor: '#00ABFF',
            color: '#fff',
            fontWeight: 'bold',
            height: 48,
            borderRadius: 2,
            '&:hover': {
              bgcolor: '#0088CC',
            },
          }}
        >
          OK
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
