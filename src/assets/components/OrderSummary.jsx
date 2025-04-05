// components/OrderSummary.jsx
import React, { memo } from 'react';
import PropTypes from 'prop-types';

const OrderSummary = memo(({ cart, totalPrice, onCheckout, user }) => {
  return (
    <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md mt-6 md:mt-0 h-fit sticky top-6">
      <h3 className="text-lg font-bold mb-4">🛒 Order Summary</h3>
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <span>Subtotal ({cart.length} items):</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>FREE</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-bold">
          <span>Total:</span>
          <span className="text-green-600">₹{totalPrice.toFixed(2)}</span>
        </div>
      </div>
      <button 
        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition mb-4"
        onClick={onCheckout}
      >
        {user ? "Proceed to Checkout" : "Login to Checkout"}
      </button>
      {!user && (
        <p className="text-sm text-center text-gray-600">
          or <a href="/registration" className="text-blue-500">create an account</a>
        </p>
      )}
    </div>
  );
});

OrderSummary.propTypes = {
  cart: PropTypes.array.isRequired,
  totalPrice: PropTypes.number.isRequired,
  onCheckout: PropTypes.func.isRequired,
  user: PropTypes.object
};

export default OrderSummary;