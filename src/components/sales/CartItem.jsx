import React from 'react';

const CartItem = ({ item }) => {
  return (
    <div className="flex justify-between bg-gray-100 p-2 rounded mb-2">
      <span>{item.name}</span>
      <span>{item.quantity} x KES {item.price}</span>
    </div>
  );
};

export default CartItem;
