import React, { useState } from 'react';
import { TextField, MenuItem, Button, Box, Typography, FormControl, InputLabel, Select, SelectChangeEvent, Hidden } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

const books = [
  { id: 1, name: 'Book 1' },
  { id: 2, name: 'Book 2' },
];

const BookUploadForm = () => {
  const [selectedBook, setSelectedBook] = useState('');
  const [bookQuantity, setBookQuantity] = useState('');
  const [rentalPrice, setRentalPrice] = useState('');
  const [age, setAge] = useState('');

  const handleBookChange = (event: any) => {
    setSelectedBook(event.target.value);
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

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
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
      <FormControl variant="filled"  size="medium" sx={{ m: 1, minWidth: '50%' }}>
        <InputLabel id="demo-simple-select-filled-label">Search book by name or Author</InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={selectedBook}
         
          placeholder='Search ...'
          onChange={handleBookChange}
          sx={{  boxShadow: 2, }}
        >
         {books.map((book) => (
          <MenuItem key={book.id} value={book.name}>
            {book.name}
          </MenuItem>
        ))}
        <MenuItem value="Add">Add</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
        <TextField
          label="Book Quantity"
          value={bookQuantity}
          onChange={handleBookQuantityChange}
          fullWidth
         size="small"
        />
        <TextField
          label="Rent price for 2 weeks"
          value={rentalPrice}
          onChange={handleRentalPriceChange}
          fullWidth
           size="small"
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
        color="primary"
        size="large"
        sx={{ mt: 2, width: '50%', borderRadius:'10px'
         }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default BookUploadForm;
