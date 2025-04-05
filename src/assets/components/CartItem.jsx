// components/CartItem.jsx
import React, { memo } from 'react';

const CartItem = memo(({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center">
        <img 
          src={item.img} 
          alt={item.name} 
          className="w-20 h-20 object-cover rounded-lg mr-4"
          onError={(e) => e.target.src = "/images/product-placeholder.jpg"}
        />
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
          <p className="text-gray-600">₹{item.new_price || item.price} × {item.quantity || 1}</p>
        </div>
      </div>
      <div className="flex items-center">
        <QuantityControl 
          quantity={item.quantity || 1}
          onDecrease={() => onQuantityChange(item.id, -1)}
          onIncrease={() => onQuantityChange(item.id, 1)}
        />
        <button 
          onClick={() => onRemove(item.id)} 
          className="ml-4 px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
        >
          Remove
        </button>
      </div>
    </div>
  );
});

const QuantityControl = memo(({ quantity, onDecrease, onIncrease }) => (
  <div className="flex items-center border rounded-md">
    <button 
      onClick={onDecrease}
      className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
    >
      -
    </button>
    <span className="px-4">{quantity}</span>
    <button 
      onClick={onIncrease}
      className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
    >
      +
    </button>
  </div>
));

export default CartItem;