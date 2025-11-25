import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="font-bold">{product.name}</h3>
      <p>Price: KES {product.price}</p>
      <p>Stock: {product.stock}</p>
    </div>
  );
};

export default ProductCard;
