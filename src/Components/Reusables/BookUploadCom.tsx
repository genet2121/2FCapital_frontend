import React, { useState } from 'react';
import { TextField, MenuItem, Button, Box, Typography } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const books = [
  { id: 1, name: 'Book 1' },
  { id: 2, name: 'Book 2' },
];

const BookUploadForm = () => {
  const [selectedBook, setSelectedBook] = useState('');
  const [bookQuantity, setBookQuantity] = useState('');
  const [rentalPrice, setRentalPrice] = useState('');

  const handleBookChange = (event: any) => {
    setSelectedBook(event.target.value);
  };

  const handleBookQuantityChange = (event:any) => {
    setBookQuantity(event.target.value);
  };

  const handleRentalPriceChange = (event:any) => {
    setRentalPrice(event.target.value);
  };

  const handleSubmit = (event:any) => {
    event.preventDefault();
    // Handle form submission logic
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
        maxWidth: 500,
        mx: 'auto',
        mt: 8,
        p: 4,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" component="h2">
        Upload New Book
      </Typography>
      <TextField
        select
        label="Search book by name or Author"
        value={selectedBook}
        onChange={handleBookChange}
        fullWidth
      >
        {books.map((book) => (
          <MenuItem key={book.id} value={book.name}>
            {book.name}
          </MenuItem>
        ))}
        <MenuItem value="Add">Add</MenuItem>
      </TextField>
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
        variant="outlined"
        component="label"
        startIcon={<CloudUploadIcon />}
        fullWidth
      >
        Upload Book Cover
        <input type="file" hidden />
      </Button>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2, width: '100%' }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default BookUploadForm;
