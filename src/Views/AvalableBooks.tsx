import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import AlertContext from '../Contexts/AlertContext';
import MainAPI from '../APIs/MainAPI';
import AuthContext from '../Contexts/AuthContext';
import { props } from '../APIs/api';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';


const AvailableBooks = () => {
  
  const { setAlert } = useContext(AlertContext);
  const { loggedUser } = useContext(AuthContext);
  const [books, setBooks] = useState<any[]>([]);
  const {cookies} = useContext(AuthContext);
 
  useEffect(() => {
    fetchBooks()
   
  }, [setAlert]);
  const fetchBooks = async () => {
    try {
      const response = await MainAPI.getAll(cookies.login_token, 'bookupload', 1, 10, {
        condition: {
          quantity: { gt: 0 },
          status: "true"
        }
      });
      setBooks(response.Items);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
 
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", padding: "0 10px", position: "relative", height: '100%' }}>
    {/* top nav */}
    <div style={{ width: "100%", height: "40px", background: "white", borderRadius: "10px", marginBottom: "10px", padding: '5px 20px', fontSize: '18px' }}>
      
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
        
        <Typography color="text.primary">Available Books</Typography>
      </Breadcrumbs>
    </div>

    <div style={{ width: "100%", overflowY: 'auto' }}>
      <div style={{ display: "flex", flexWrap: "wrap", width: "100%", height: "100%", background: "transparent", marginBottom: "10px", borderRadius: "10px" }}>
        {books.map((book) => (
          <div key={book.id} style={{ width: "24%", background: "white", padding: "10px", marginRight: "10px", marginBottom: "10px", borderRadius: "8px" }}>
            <img src={`${props.baseURL}file/${book.book_cover}`} alt="cover" style={{ width: "100%", height: "auto", marginBottom: "5px" }} />
            <h5 style={{ fontSize: "20px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px" }}>
              {book.book.name}
            </h5>
            <span style={{ fontSize: "12px", fontWeight: "normal", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px" }}>
              Author: {book.book.author}
            </span>
            <br />
            <span style={{ fontSize: "12px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px" }}>
              Available: {book.quantity} Copies
            </span>
            <br />
            <span style={{ fontSize: "12px", fontWeight: "bold", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, marginBottom: "5px" }}>
              Price: {book.price} Birr
            </span>
            <br />
          </div>
        ))}
      </div>
    </div>
  </div>
   
  );
 
  
};

export default AvailableBooks;



 
