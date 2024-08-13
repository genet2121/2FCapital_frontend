import React, { useContext, useEffect, useState } from 'react';
import { TextField, MenuItem, Button, Box, FormControl, InputLabel, Select } from '@mui/material';
import AlertContext from '../Contexts/AlertContext';
import MainAPI from '../APIs/MainAPI';
import AuthContext from '../Contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

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

function NewRent() {

  const {setAlert, setWaiting} = useContext(AlertContext);
  const {cookies} = useContext(AuthContext);
  const { loggedUser } = useContext(AuthContext);


  const [queryParams, setQueryParams] = useSearchParams();

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [currentRent, setCurrentRent] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({}); // {id: 3, answer: ""}
  const [inputs, setInputs] = useState<{book_id: number, quantity: number, price: number, status: string}>({
    book_id: 0,
    quantity: 0,
    price: 0,
    status: "rented"
  });

  useEffect(() => {
    fetchBooks();
    loadCurrentRent();
  }, [])

  useEffect(() => {
    if(selectedBook) {
      setInputs({...inputs, price: inputs.quantity * selectedBook.price});
      selectedBook.questionaries.forEach((qnr: any) => {
        let element: any = document.getElementById(`questionary_${qnr.id}`);
        if(element) {
          element.value = answers[qnr.id] ?? "";
        }
      })
    }
  }, [selectedBook]);

  useEffect(() => {
    if(currentRent) {
      fetchSelectedBook(currentRent.upload_id);
    }
  }, [currentRent]);

  const loadCurrentRent = async () => {
    let id = queryParams.get("rent_id");
    if(!id) {
      return;
    }

    try {

      const response = await MainAPI.getSingle(cookies.login_token, 'rent', parseInt(id));
      setInputs({
        book_id: response.upload_id,
        quantity: response.quantity,
        price: response.total_price,
        status: response.status,
      });
      setCurrentRent(response);
      let temp_answers: any = {};
      response.additionalAnswer.forEach((qnr: any) => {
        temp_answers[qnr.question_id] = qnr.answer;
      })
      setAnswers(temp_answers);

      console.log(" question name ", response.additionalAnswer);

    } catch (error: any) {
      setAlert(error.message, "error");
    }
  }

  const fetchBooks = async () => {
    try {
      const response = await MainAPI.getAll(cookies.login_token, 'bookupload', 1, 10, {
        condition: {
          quantity: { gt: 0 },
          status: "true"
        }
      });
      setAllBooks(response.Items);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSelectedBook = async (bk_id: number) => {
    try {
      const response = await MainAPI.getSingle(cookies.login_token, 'bookupload', bk_id);
      setSelectedBook(response);
    } catch (error: any) {
      setAlert(error.message, "error");
    }
  };

  const handleInputChange = (name: string, value: any) => {

    let temp = {...inputs, [name]: value};
    if(selectedBook) {
      temp.price = temp.quantity * selectedBook.price;
    }
    setInputs(inp => ({...temp}));
    if(name == "book_id") {
      onBookChange(value);
    }
  };

  const handleAnswersInputChange = (name: string, value: any) => {
    let temp = {...answers, [name]: value};
    console.log(answers);
    setAnswers((inp: any) => ({...temp}));
  };

  const onBookChange = (book_id: number) => {

    let found_book = allBooks.find(bk => bk.id == book_id);
    console.log("found book ", found_book);
    setSelectedBook(found_book);

  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {

      let temp_answers: any = [];
      if(inputs.book_id < 1 || inputs.price <= 0 || inputs.quantity < 1) {
        throw new Error("some properties should be filled!");
      }

      selectedBook.questionaries.forEach((qnr: any) => {
        console.log(qnr.name, answers[qnr.id]);
        if(answers[qnr.id] == "" || !answers[qnr.id]) {
          throw new Error(`questionary ${qnr.question} should not be empty`);
        } else {
          temp_answers.push({
            id: qnr.id,
            answer: answers[qnr.id]
          })
        }
      });

      let new_rent: any = {
        quantity: parseInt(`${inputs.quantity}`),
        upload_id: selectedBook.id,
        total_price: parseFloat(`${inputs.price}`),
        status: inputs.status,
        answers: temp_answers,
      };

      if(!currentRent) {
        await MainAPI.createNew(cookies.login_token, 'rent', new_rent);
        setAlert("rent upload successful!", "success");
      } else {
        await MainAPI.update(cookies.login_token, 'rent', {...new_rent, id: currentRent.id});
        setAlert("rent update successful!", "success");
      }

    } catch (error: any) {
      setAlert(error.message, "error");
    }
  };


  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", padding: "0 10px 0 0", height: "100%", position: "relative"}}>

        {/* top nav */}
        <div style={{display: "flex", width: "100%", height: "40px", background: "white", borderRadius: "10px", marginBottom: "10px", padding: "5px 2rem"}}>
          <span style={{margin: "auto 0"}}>
          <Breadcrumbs aria-label="breadcrumb">
          {
            loggedUser.Roles.includes("admin") ? (
              <Link underline="hover" color="inherit" href="/">
                Administrator
              </Link>
            ) : (
              <Link underline="hover" color="inherit" href="/">
                Owner
              </Link>
            )
          }
        
        <Typography color="text.primary">New Rent</Typography>
      </Breadcrumbs>
          </span>
        </div>

        <div style={{background: "white", display: "flex", flexDirection: "row", height: "100%", width: "100%", borderRadius: "10px", overflowY: "auto"}}>

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
                        value={inputs.book_id}
                        onChange={(event: any) => {handleInputChange("book_id", event.target.value)}}
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

                </Box>
            
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                    <TextField
                      label="Book Quantity"
                      value={inputs.quantity}
                      onChange={(event: any) => {handleInputChange("quantity", event.target.value)}}
                      fullWidth
                    />
                    <TextField
                      label="Total Price"
                      value={inputs.price}
                      fullWidth
                      disabled={true}
                      onChange={(event: any) => {handleInputChange("price", event.target.value)}}
                    />
                </Box>

                <FormControl variant="filled" size="medium" fullWidth>
                  <InputLabel id="demo-simple-select-filled-label">
                    Status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={inputs.status}
                    onChange={(event: any) => {handleInputChange("status", event.target.value)}}
                    sx={{ boxShadow: 2 }}
                    disabled={currentRent == null}
                  >
                    <MenuItem disabled value="">
                      <em>Select Status</em>
                    </MenuItem>
                      <MenuItem value={"rented"}> Rented </MenuItem>
                      <MenuItem value="returned">Returned</MenuItem>
                  </Select>
                </FormControl>

                <hr style={{background: "black", color: "black", width: "100%"}}/>

                {
                  selectedBook ? selectedBook.questionaries.map((qnr: any) =>
                    (
                      <TextField
                        key={`questionary_${qnr.id}`}
                        id={`questionary_${qnr.id}`}
                        label={qnr.question}
                        value={answers[qnr.name]}
                        onChange={(event: any) => {handleAnswersInputChange(qnr.id, event.target.value)}}
                        fullWidth
                      />
                    )
                  ) : (<></>)
                }
                
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ mt: 2, width: '50%', borderRadius: '10px', background: '#00ABFF', height: '54px' }}
                    onClick={handleSubmit}
                >
                    Rent
                </Button>
                
            </Box>

        </div>
    </div>
  );
  
};

export default NewRent;
