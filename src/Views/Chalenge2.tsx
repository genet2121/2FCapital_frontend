import React from 'react';
import { Box, Container, Grid, TextField, Button, Card, CardMedia, CardContent, Typography, IconButton, AppBar, Toolbar, Badge, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
const Chalenge = () => {
    return (
        <Container maxWidth="lg">
          <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 4, borderBottom: '1px solid #ddd' }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                Etsy
              </Typography>
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
          </AppBar>
          
          <Box mb={4}>
            <Card sx={{ display: 'flex', height: 180 }}>
              <CardMedia
                component="img"
                sx={{ width: 180, height: 150 }}
                image="/mnt/data/image.png"
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
                    image="/mnt/data/image.png"
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
