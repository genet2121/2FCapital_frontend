import React, { useContext, useState } from 'react';
import { TextField, MenuItem, Button, Box, Typography, FormControl, InputLabel, Select, SelectChangeEvent, Hidden, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import AlertContext from '../Contexts/AlertContext';
import MainAPI from '../APIs/MainAPI';
import AuthContext from '../Contexts/AuthContext';

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

function NewRent() {

  const {setAlert, setWaiting} = useContext(AlertContext);
  const {cookies} = useContext(AuthContext);

  const [selectedBook, setSelectedBook] = useState(null);
  const [bookQuantity, setBookQuantity] = useState(0);
  const [rentalPrice, setRentalPrice] = useState(0);
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [answers, setAnswers] = useState([]);

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

  const loadAllBooks = async () => {
    setTimeout(() => {setWaiting(true)}, 10);
    try {

      let response = await MainAPI.getAll(cookies.login_token, "bookupload", 1, 10, {condition: {
        quantity: { gt: 0 }
      }});
      setAllBooks(response.Items);

    } catch(error: any) {
      setAlert(error.message, "error");
    }
    setWaiting(false);
  }

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
    <div style={{ display: "flex", flexDirection: "column", width: "100%", padding: "0 10px 0 0", height: "100%", position: "relative" }}>

        {/* top nav */}
        <div style={{display: "flex", width: "100%", height: "40px", background: "white", borderRadius: "10px", marginBottom: "10px", padding: "5px 2rem"}}>
          <span style={{margin: "auto 0"}}>Owner/New Rent</span>
        </div>

        <div style={{background: "white", display: "flex", flexDirection: "row", height: "100%", width: "100%", borderRadius: "10px"}}>

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
                    New Book Rent
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                    <FormControl variant="filled" size="medium" fullWidth>
                    <InputLabel id="demo-simple-select-filled-label">
                        Available Books
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={selectedBook}
                        onChange={() => {}}
                        sx={{ boxShadow: 2 }}
                    >
                        <MenuItem disabled value="">
                          <em>Select Book</em>
                        </MenuItem>
                        {
                          allBooks.map((book) => (
                            <MenuItem key={book.id} value={book.id}>
                                {book.book.name}
                            </MenuItem>
                          ))
                        }
                    </Select>
                    </FormControl>
                    
                    {/* <FormControl fullWidth>
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
                    </FormControl> */}
                </Box>
            
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                    <TextField
                      label="Book Quantity"
                      value={bookQuantity}
                      onChange={handleBookQuantityChange}
                      fullWidth
                    />
                    <TextField
                      label="Total Price"
                      value={rentalPrice}
                      fullWidth
                      disabled={true}
                    />
                </Box>

                <hr style={{background: "black", color: "black", width: "100%"}}/>

                {

                  (
                    <TextField
                      label="Total Price"
                      value={rentalPrice}
                      onChange={handleRentalPriceChange}
                      fullWidth
                    />
                  )
                }
                
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ mt: 2, width: '50%', borderRadius: '10px', background: '#00ABFF', height: '54px' }}
                >
                    Rent
                </Button>
                
            </Box>

        </div>
    </div>
  );
  
};

export default NewRent;
