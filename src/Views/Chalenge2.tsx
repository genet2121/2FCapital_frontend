import React from 'react';
import { Box, Container, Grid, TextField, Button, Card, CardMedia, CardContent, Typography, IconButton, AppBar, Toolbar, Badge, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import Rating from '@mui/material/Rating';
import Chip from '@mui/material/Chip';
const Chalenge = () => {
    return (
      <Container maxWidth={false} sx={{ background: 'white', width: '100%', padding: 0 }}>
      {/* <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 4, borderBottom: '1px solid #ddd' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Etsy
            
          </Typography>
          <div><MenuIcon /></div>
          <TextField
            variant="outlined"
            placeholder="Search for items"
            size="small"
            sx={{
              mr: 2,
              width: '300px',
              backgroundColor: '#fff',
              borderRadius: '20px',
              '& .MuiOutlinedInput-root': {
                paddingRight: 0,
                '& fieldset': {
                  borderColor: '#ddd',
                },
                '&:hover fieldset': {
                  borderColor: '#888',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#555',
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton sx={{ backgroundColor: '#f0f0f0', borderRadius: '0 20px 20px 0', padding: '10px 15px' }}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <FavoriteBorderIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={2} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar> */}
     <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 4, borderBottom: '1px solid #ddd' }}>
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ mr:10, fontWeight: 'bold', flexShrink: 0, color: 'orange', fontSize: '32px',  }}>
        Etsy
      </Typography>
      <div style={{ display: 'flex', alignItems: 'center',  }}>
  <MenuIcon sx={{ mr: 1, mt: 0 }} /> 
  <Typography variant="body1">Categories</Typography>
</div>
    
    <TextField
  variant="outlined"
  placeholder="Search for items"
  size="small"
  sx={{
    mr: 2,
    ml: 3,
    width: '80%',
    backgroundColor: '#fff',
    
    '& .MuiOutlinedInput-root': {
      borderRadius: '50px',  
      paddingRight: 0,
      '& fieldset': {
        borderColor: 'black',
      },
      '&:hover fieldset': {
        borderColor: '#888',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#555',
      },
    },
  }}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton 
          sx={{ 
            backgroundColor: 'orange',  
            borderRadius: '100%',        
            padding: '5px 5px', 
            marginRight:'5px'       
          }}
        >
          <SearchIcon />
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

      {/* <div style={{ display: 'flex', flexShrink: 0 }}>
      <Badge >
            Sign in
          </Badge>
         
        <IconButton color="inherit">
          <Badge  color="error">
            <FavoriteBorderIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit">
          <Badge  color="error">
            < CardGiftcardIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit">
          <Badge  color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </div> */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
  <Typography variant="body1" sx={{ mr: 2 }}>Sign in</Typography>
  
  <IconButton color="inherit">
    <Badge color="error">
      <FavoriteBorderIcon />
    </Badge>
  </IconButton>
  
  <IconButton color="inherit">
    <Badge color="error">
      <CardGiftcardIcon />
    </Badge>
  </IconButton>
  
  <IconButton color="inherit">
    <Badge color="error">
      <ShoppingCartIcon />
    </Badge>
  </IconButton>
</div>

    </Toolbar>
    <div style={{
  width: '80%',
  alignItems: 'center',
  marginLeft: '350px',
  display: 'flex',
  gap: '20px', 
  marginBottom: '10px'

}}>
  <Typography display="flex" alignItems="center" sx={{fontFamily: 'serif'}}>
    <CardGiftcardIcon sx={{ mr: 1 }} /> Gift Mode
  </Typography>
  <Typography sx={{fontFamily: 'serif'}}>Back-to-school saving</Typography>
  <Typography sx={{fontFamily: 'serif'}}>Home Favorities</Typography>
  <Typography sx={{fontFamily: 'serif'}}>Fashion Finds</Typography>
  <Typography sx={{fontFamily: 'serif'}}>Registry</Typography>
</div>

  </AppBar>

      {/* <Box mb={4}>
        <Card sx={{ display: 'flex', height: 180 }}>
          <CardMedia
            component="img"
            sx={{ width: 180, height: 150 }}
            image="images/prod.jpg"
            alt="Featured product"
          />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Football Field Pencil Case, Soccer Field Zipper Pouch
            </Typography>
            <Typography variant="body1" color="text.secondary">
              USD 19.00
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2, alignSelf: 'start' }}>
              Shop this item
            </Button>
          </CardContent>
        </Card>
      </Box> */}
    <Box
      mb={4}
      ml={4}
      sx={{
        display: 'flex',
        height: 225,
        borderBottom: '1px solid #ddd',
        borderRadius: 1,
      }}
    >
      <div style={{ width: 200, height: '100%', overflow: 'hidden' }}>
        <img
          src="images/prod.jpg"
          alt="Featured product"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          justifyContent: 'space-between',
         
        }}
      >
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <a href="#" style={{ color: 'black', marginRight: '8px' }}>AxelleJoly</a>
          <Rating
            name="no-value"
            value={5}
            style={{ color: 'black', marginRight: '8px', fontSize: '16px' }}
          />
          <span>(411)</span>
        </div>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          Kavachi, Men's pearl bracelet, all-stone <br /> bracelet, cultured pearl bracelet, agate bracelet, gift idea, Men's jewelry
        </Typography>
        <Typography sx={{  mb: 1 }} style={{fontSize: '16px'}}>
          USD 19.00
        </Typography>
        <Chip label="FREE shipping" sx={{  width: 115, height: 20,  background:'#A0E193' }} />
        <Button variant="outlined"  sx={{ mt: 2, alignSelf: 'start', border:'1px black solid', borderRadius: '50px', color: 'black'}}>
          Shop this item
        </Button>
      </Box>
    </Box>
      <Box display="flex" alignItems="center" mb={2}>
        <FilterListIcon />
        <Typography variant="subtitle1" sx={{ ml: 1 }}>
          All Filters
        </Typography>
      </Box>
    
      <Grid container spacing={2}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                sx={{ height: 140 }}
                image="/images/prod.jpg"
                alt="Product"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Personalized Soccer Ball
                </Typography>
                <Typography variant="body1" color="text.primary">
                  USD 18.00
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    
      );
};

export default Chalenge;
