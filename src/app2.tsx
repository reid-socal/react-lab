import React from 'react';

function ProductCard({ name, price, imageUrl, onAddToCart }) {
  return (
    <div className="product-card">
      <img src={imageUrl} alt={name} className="product-image" />
      <h2 className="product-name">{name}</h2>
      <p className="product-price">${price}</p>
      <button onClick={onAddToCart} className="add-to-cart-button">
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;