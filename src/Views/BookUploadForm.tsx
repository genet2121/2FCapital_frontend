import React from 'react';
import { CssBaseline, Container } from '@mui/material';
import BookUploadForm from '../Components/Reusables/BookUploadCom';

const BookUpload = () => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <BookUploadForm />
      </Container>
    </>
  );
};

export default BookUpload;
