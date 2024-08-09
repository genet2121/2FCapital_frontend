import React, { useState } from 'react';
import { TextField, MenuItem, Button, Box, Typography, FormControl, InputLabel, Select, SelectChangeEvent, Hidden, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Email',
  'Phone Number',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];
const books = [
  { id: 1, name: 'Book 1' },
  { id: 2, name: 'Book 2' },
];

const BookUploadForm = () => {
  const [selectedBook, setSelectedBook] = useState('');
  const [bookQuantity, setBookQuantity] = useState('');
  const [rentalPrice, setRentalPrice] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);


 
  const handleBookChange = (event:any) => {
    if (event.target.value === 'Add') {
      setIsDialogOpen(true);
    } else {
      setSelectedBook(event.target.value);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const handleBookQuantityChange = (event: any) => {
    setBookQuantity(event.target.value);
  };

  const handleRentalPriceChange = (event: any) => {
    setRentalPrice(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Handle form submission logic
  };

  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        width: '100%',
        maxWidth: 700,
        mx: 'auto',
        mt: 8,
        p: 4,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" component="h2">
        Upload New Book
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
        <FormControl variant="filled" size="medium" fullWidth>
          <InputLabel id="demo-simple-select-filled-label">
            Search book by name or Author
          </InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={selectedBook}
            onChange={handleBookChange}
            sx={{ boxShadow: 2 }}
          >
            <MenuItem disabled value="">
              <em>Search...</em>
            </MenuItem>
            {books.map((book) => (
              <MenuItem key={book.id} value={book.name}>
                {book.name}
              </MenuItem>
            ))}
            <MenuItem value="Add" sx={{color: '#00ABFF'}}>Add</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth>
          <InputLabel id="demo-multiple-checkbox-label">questioner's</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {names.map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={personName.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
  
      <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
        <TextField
          label="Book Quantity"
          value={bookQuantity}
          onChange={handleBookQuantityChange}
          fullWidth
        />
        <TextField
          label="Rent price for 2 weeks"
          value={rentalPrice}
          onChange={handleRentalPriceChange}
          fullWidth
        />
      </Box>
  
      <Button
        component="label"
        startIcon={<FileUploadOutlinedIcon />}
        fullWidth
      >
        Upload Book Cover
        <input type="file" hidden />
      </Button>
      
      <Button
        type="submit"
        variant="contained"
        size="large"
        sx={{ mt: 2, width: '50%', borderRadius: '10px', background: '#00ABFF', height: '54px' }}
      >
        Submit
      </Button>
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle sx={{textAlign: 'center'}}>Add a New Book</DialogTitle>
        <DialogContent>
          {/* Dialog content goes here */}
          <TextField
          label="Book Name"
          id="filled-size-normal"
          defaultValue="Book Name"
          variant="filled"
          fullWidth
        />
          <TextField
          label="Author Name"
          id="filled-size-normal"
          defaultValue="Author Name"
          variant="filled"
          fullWidth
          sx={{ mt: 2 }}
        />
         <TextField
          id="filled-select-currency"
          select
          label="Category"
          defaultValue="Category"
          fullWidth
          variant="filled"
          sx={{ mt: 2 }}
        >
        <MenuItem disabled value="">
        <em>Category</em>
        </MenuItem>
        </TextField>
        <Button onClick={handleDialogClose} variant="contained" color="primary" fullWidth sx={{ mt: 2, background:'#00ABFF', height:'60px' }}>
            Add
          </Button>
          {/* <TextField label="Author" fullWidth sx={{ mt: 2 }} /> */}
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleDialogClose} >Cancel</Button> */}
         
        </DialogActions>
      </Dialog>
    </Box>
  );
  
};

export default BookUploadForm;
