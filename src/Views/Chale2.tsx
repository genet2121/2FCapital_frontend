import React from "react";
import "./ProductPage.css";
import MenuIcon from '@mui/icons-material/Menu';
// Define any props if needed in the future
interface ProductPageProps {}

const ProductPage: React.FC<ProductPageProps> = () => {
  return (
    <div className="product-page">
      <header className="header">
        <div className="header-content">
          <div className="menu-logo">
            <img
              className="menu-icon"
              src="https://img.icons8.com/material-outlined/24/000000/menu--v1.png"
              alt="Menu"
            />
            {/* <MenuIcon className="menu-icon" /> */}
            <div className="logo">Etsy</div>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search" />
            <button type="submit">
              <img
                src="https://img.icons8.com/material-outlined/24/FFFFFF/search--v1.png"
                alt="Search"
              />
            </button>
          </div>
          <div className="icons">
            <img
              src="https://img.icons8.com/material-outlined/24/000000/user.png"
              alt="User"
            />
            <img
              src="https://img.icons8.com/material-outlined/24/000000/gift.png"
              alt="Gift"
            />
            <img
              src="https://img.icons8.com/material-outlined/24/000000/shopping-cart.png"
              alt="Cart"
            />
          </div>
        </div>
      </header>

      <div className="product-content">
        <div className="product-image">
          <img src="https://via.placeholder.com/600x400" alt="Product" />
          <div className="badge">Etsy's Pick</div>
        </div>

        <div className="product-info">
          <h2 className="rare-find">RARE FIND</h2>
          <h1 className="price">USD 50.79</h1>
          <p className="tax-info">
            Local taxes included (where applicable)
          </p>
          <p className="product-description">
            Soccer Ball Necklace-Football Beaded Necklace-Soccer Fans Gift-Soccer Ball Charm Necklace-Ball Charm-Football Charm Necklace-Green Necklace
          </p>
          <div className="seller-info">
            <span className="seller-name">DreamBeadsDovi</span>
            <span className="rating">★★★★★</span>
          </div>
          <p className="return-info">✔ Returns & exchanges accepted</p>
          <button className="add-to-cart">Add to cart</button>
        </div>
      </div>

      <div className="additional-info">
        <p><strong>Item details</strong></p>
        <p><strong>Shipping and return policies</strong></p>
        <p><strong>Shop ratings for DreamBeadsDovi</strong> - 88 sales ★★★★★ (31 ratings)</p>
      </div>
    </div>
  );
};

export default ProductPage;
