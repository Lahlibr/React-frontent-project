import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userCartKey = user ? `cart_${user.email}` : null;
  
  const [cart, setCart] = useState(() => {
    return userCartKey ? JSON.parse(localStorage.getItem(userCartKey)) || [] : [];
  });

  useEffect(() => {
    if (!user) {
      alert("Please log in to view your cart.");
      return navigate("/login");
    }
    setCart(JSON.parse(localStorage.getItem(userCartKey)) || []);
  }, [userCartKey, navigate]);

  const updateCart = (updatedCart) => {
    localStorage.setItem(userCartKey, JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const removeFromCart = (productId) => updateCart(cart.filter(item => item.id !== productId));
  
  const changeQuantity = (productId, amount) => {
    updateCart(cart.map(item => item.id === productId ? { ...item, quantity: Math.max(1, (item.quantity || 1) + amount) } : item));
  };

  const getTotalPrice = () => cart.reduce((total, item) => total + item.new_price * (item.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row p-6">
      {/* Left Section - Deals */}
      <div className="hidden md:flex flex-col w-1/4 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4">🌟 Featured Deal</h3>
        <img src="images/add1.jpeg" alt="Featured Product" className="rounded-lg shadow-md mb-4"/>
        <p className="text-gray-600">🔥 Exclusive deal on premium items! Buy now & save big.</p>
        <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">Shop Now</button>
        <div className="mt-6 bg-yellow-100 p-4 rounded-lg">
          <h4 className="text-md font-bold">💰 Limited-Time Offer</h4>
          <p className="text-gray-600 mt-2">Use code <strong>SAVE20</strong> for 20% off.</p>
        </div>
        <div className="mt-6 bg-green-100 p-4 rounded-lg">
          <h4 className="text-md font-bold">🚚 Free Shipping</h4>
          <p className="text-gray-600 mt-2">On orders above ₹999.</p>
        </div>
      </div>

      {/* Center Section - Cart Items */}
      <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md mx-4">
        {user && (
          <div className="mb-6 flex items-center">
            <img src="images/user.jpg" alt="User Avatar" className="w-12 h-12 rounded-full"/>
            <div className="ml-4">
              <h2 className="text-xl font-bold">{user.username}'s Cart</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        )}

        {cart.length ? cart.map(item => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4 mb-4">
            <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded-lg"/>
            <div className="flex-1 ml-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600">₹{item.new_price} x {item.quantity || 1}</p>
            </div>
            <div className="flex items-center">
              <button onClick={() => changeQuantity(item.id, -1)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">-</button>
              <span className="px-4">{item.quantity || 1}</span>
              <button onClick={() => changeQuantity(item.id, 1)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">+</button>
              <button onClick={() => removeFromCart(item.id)} className="ml-4 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-700">Remove</button>
            </div>
          </div>
        )) : <p className="text-center text-gray-500">Your cart is empty.</p>}
      </div>

      {/* Right Section - Order Summary */}
      <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md mt-6 md:mt-0">
        <h3 className="text-lg font-bold mb-4">🛒 Order Summary</h3>
        <p className="text-gray-600">Items in Cart: <strong>{cart.length}</strong></p>
        <p className="text-gray-600 mt-2">Total Price: <span className="text-green-500 font-bold">₹{getTotalPrice()}</span></p>
        <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md w-full hover:bg-green-700">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;
