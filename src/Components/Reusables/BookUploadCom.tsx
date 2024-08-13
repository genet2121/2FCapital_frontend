import React, { useContext, useEffect, useState } from 'react';
import { TextField, MenuItem, Button, Box, Typography, FormControl, InputLabel, Select, SelectChangeEvent, Hidden, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import MainAPI from '../../APIs/MainAPI';
// import Cookies from 'js-cookie';
import { Category } from '../../Intefaces/Category';
import AuthContext from '../../Contexts/AuthContext';
import AlertContext from '../../Contexts/AlertContext';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import SuccessDialog from './SucessDilog';


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

const BookUploadForm = () => {

  const {cookies} = useContext(AuthContext);
  const {setAlert} = useContext(AlertContext);

  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useSearchParams();

  const [selectedBook, setSelectedBook] = useState(0);
  const [bookQuantity, setBookQuantity] = useState(0);
  const [rentalPrice, setRentalPrice] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // State for dialog form
  const [bookName, setBookName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [questionaries, setQuestionaries] = useState<any[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
  const [questionName, setQuestionName] = React.useState<string[]>([]);
  const [coverId, setCoverId] = React.useState<any>(null);
  const [status, setStatus] = React.useState<string>("true");
  const [bookUploadId, setBookUploadId] = React.useState<number>(0);
  const [currentUpload, setCurrentUpload] = React.useState<any>(null);



  useEffect(() => {
    fetchCategories();
    fetchBooks();
    fetchQuestionaries();
    loadBookUpload();
  }, [queryParams]);

  const loadBookUpload = async () => {
    let id = queryParams.get("book_upload_id");
    if(!id) {
      return;
    }
    setBookUploadId(parseInt(id));
    try {

      const response = await MainAPI.getSingle(cookies.login_token, 'bookupload', parseInt(id));
      setBookQuantity(response.quantity);
      setSelectedBook(response.book_id);
      setRentalPrice(response.price);
      // setCoverId(response.book_cover);
      setQuestionName(response.questionaries.map((qnr: any) => qnr.id));
      setSelectedQuestions(response.questionaries);
      setCurrentUpload(response);

      console.log(" question name ", response.questionaries);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  const fetchCategories = async () => {
    try {
      const token = cookies.login_token;
      const condition = { type: 'book_category' };
      const response = await MainAPI.getAll(token, 'choice', 1, 10, {condition});
      setCategories(response.Items);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await MainAPI.getAll(cookies.login_token, 'book', 1, 10, {});
      setAllBooks(response.Items);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchQuestionaries = async () => {
    try {
      const response = await MainAPI.getAll(cookies.login_token, 'basequestionary', 1, 10, {});
      setQuestionaries(response.Items);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryChange = (event:any) => {
    setSelectedCategory(event.target.value);
  };
  
  const handleBookChange = (event:any) => {
    if (event.target.value === 'Add') {
      setIsDialogOpen(true);
    } else {
      setSelectedBook(parseInt(event.target.value));
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const handleAddBook = async () => {
    try {
      const token = cookies.login_token;
      const newBook = {
        name: bookName,
        author: authorName,
        category: selectedCategory
      };
      await MainAPI.createNew(token, 'book', newBook);
      // Optionally, handle successful response here
      handleDialogClose(); // Close the dialog
      fetchBooks();
    } catch (error: any) {
      setAlert(error.message, "error");
    }
  };
  const handleBookQuantityChange = (event: any) => {
    setBookQuantity(event.target.value);
  };

  const handleRentalPriceChange = (event: any) => {
    setRentalPrice(event.target.value);
  };

  const handleStatusChange = (event: any) => {
    setStatus(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {

      if(bookQuantity < 1 || selectedBook < 1 || rentalPrice <= 0 || (!coverId && !currentUpload)) {
        throw new Error("some properties should be filled!");
      }

      let new_upload: any = {
        quantity: parseFloat(`${bookQuantity}`) ?? 0,
        book_id: selectedBook,
        price: parseFloat(`${rentalPrice}`) ?? 0,
        status,
        questionaries: questionName,
      };

      if(coverId) {
        let file_id = await handleCoverUpload();
        new_upload.book_cover = file_id;
      } else {
        new_upload.book_cover = currentUpload.book_cover;
      }

      if(bookUploadId == 0) {
        await MainAPI.createNew(cookies.login_token, 'bookupload', new_upload);
        setAlert("book upload successful!", "success");
      } else {
        await MainAPI.update(cookies.login_token, 'bookupload', {...new_upload, id: bookUploadId});
        setAlert("book update successful!", "success");
      }

      navigate("/success");

    } catch (error: any) {
      setAlert(error.message, "error");
    }
  };

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const { target: { value } } = event;
    console.log(" selected ", value);
    let selections = typeof value == "string" ? value.split(", ") : value;
    let found_questionaries = questionaries.filter(qnr => selections.includes(qnr.id));
    setQuestionName(selections);
    setSelectedQuestions(found_questionaries);
  };

  const handleCoverUpload = async () => {

    try {
      let response = await MainAPI.addAttachment(cookies.login_token, "bookupload", 0, {
        file: coverId,
        name: "book cover"
      });
      // setCoverId(parseInt(response.id));
      return parseInt(response.id);

    } catch(error: any) {
      setAlert(error.message, "error");
      return 0;
    }

  }

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
              <em>Selecct Book</em>
            </MenuItem>
            {allBooks.map((book) => (
              <MenuItem key={book.id} value={book.id}>
                {book.name}
              </MenuItem>
            ))}
            <MenuItem value="Add" sx={{color: '#00ABFF'}}>Add</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth>
          <InputLabel id="demo-multiple-checkbox-label">Questioneries</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={questionName}
            onChange={handleChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => { return selectedQuestions.map(sq => sq.question).join(", ")}}
            MenuProps={MenuProps}
          >
            {questionaries.map((questionary) => (
              <MenuItem key={questionary.id} value={questionary.id}>
                <Checkbox checked={questionName.includes(questionary.id)} />
                <ListItemText primary={questionary.question} />
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

      <FormControl variant="filled" size="medium" fullWidth>
        <InputLabel id="demo-simple-select-filled-label">
          Status
        </InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={status}
          onChange={handleStatusChange}
          sx={{ boxShadow: 2 }}
          disabled={bookUploadId == 0}
        >
          <MenuItem disabled value="">
            <em>Select Status</em>
          </MenuItem>
            <MenuItem value={"true"}>
              Active
            </MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
        </Select>
      </FormControl>
  
      <Button
        component="label"
        startIcon={<FileUploadOutlinedIcon />}
        fullWidth
      >
        Upload Book Cover
        <input type="file" hidden id="book_cover_input" onChange={(event: any) => {setCoverId(event.target.files[0])}} />
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
        <DialogTitle sx={{ textAlign: 'center' }}>Add a New Book</DialogTitle>
        <DialogContent>
          <TextField
            label="Book Name"
            variant="filled"
            fullWidth
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
          />
          <TextField
            label="Author Name"
            variant="filled"
            fullWidth
            sx={{ mt: 2 }}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
          <TextField
            select
            label="Category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            fullWidth
            variant="filled"
            sx={{ mt: 2 }}
          >
            <MenuItem disabled value="">
              <em>Select a Category</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
         
          
          <Button onClick={handleAddBook} variant="contained" color="primary" fullWidth sx={{ mt: 2, background: '#00ABFF', height: '60px' }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
  
};

export default BookUploadForm;
