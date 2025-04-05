import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [cart, setCart] = useState([]);

  // Load cart data when component mounts or user changes
  useEffect(() => {
    const loadCart = () => {
      try {
        if (user) {
          
          axios.get(`http://localhost:3001/users/${user.id}`)
            .then((response) => {
              const userCart = response.data.cart || [];
              setCart(userCart.map(item => ({
                ...item,
                quantity: item.quantity || 1 
              })));
            });
        } else {
          // Load from localStorage for guests
          const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
          setCart(guestCart.map(item => ({
            ...item,
            quantity: item.quantity || 1
          })));
        }
      } catch (error) {
        console.error("Cart loading error:", error);
        toast.error("Failed to load cart");
      }
    };
  
    loadCart();
  }, [user]);

  
  const updateCart = async (updatedCart) => {
    try {
      // Ensure all items have quantity
      const normalizedCart = updatedCart.map(item => ({
        ...item,
        quantity: item.quantity || 1
      }));

      if (user) {
        // Update in API and localStorage for logged-in users
        await axios.patch(`http://localhost:3001/users/${user.id}`, { 
          cart: normalizedCart 
        });
        localStorage.setItem("user", JSON.stringify({ 
          ...user, 
          cart: normalizedCart 
        }));
      } else {
        // Update localStorage for guest users
        localStorage.setItem("guestCart", JSON.stringify(normalizedCart));
      }

      setCart(normalizedCart);
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    updateCart(updatedCart);
    toast.success("Item removed from cart!");
  };

  const changeQuantity = (productId, amount) => {
    const updatedCart = cart.map((item) => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, (item.quantity || 1) + amount);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      return total + (item.new_price || item.price || 0) * (item.quantity || 1);
    }, 0);
  };

  const handleBuyNow = useCallback(() => {
    if (!cart.length) {
      toast.info("Your cart is empty");
      return;
    }

    if (user) {
      navigate("/checkout");
    } else {
      toast.info("Please login to proceed to checkout");
      // Save current URL to redirect back after login
      localStorage.setItem("redirectAfterLogin", "/cart");
      navigate("/login");
    }
  }, [navigate, user, cart]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row p-6">
      <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md mx-4">
        {user ? (
          <div className="mb-6 flex items-center">
            <img 
              src={user.avatar || "images/user.jpg"} 
              alt="User Avatar" 
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.target.src = "images/user.jpg";
              }}
            />
            <div className="ml-4">
              <h2 className="text-xl font-bold">{user.username}'s Cart</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-xl font-bold">Guest Cart</h2>
            <p className="text-gray-600">
              Please <a href="/login" className="text-blue-500">login</a> to save your cart
            </p>
          </div>
        )}

        {cart.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size || 'default'}`} className="flex items-center justify-between py-4">
                <div className="flex items-center">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                    onError={(e) => {
                      e.target.src = "images/product-placeholder.jpg";
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                    <p className="text-gray-600">₹{item.new_price || item.price} × {item.quantity || 1}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center border rounded-md">
                    <button 
                      onClick={() => changeQuantity(item.id, -1)} 
                      className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity || 1}</span>
                    <button 
                      onClick={() => changeQuantity(item.id, 1)} 
                      className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="ml-4 px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <button 
              onClick={() => navigate("/")} 
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md mt-6 md:mt-0 h-fit sticky top-6">
          <h3 className="text-lg font-bold mb-4">🛒 Order Summary</h3>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Subtotal ({cart.length} items):</span>
              <span>₹{getTotalPrice()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span className="text-green-600">₹{getTotalPrice()}</span>
            </div>
          </div>
          <button 
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition mb-4"
            onClick={handleBuyNow}
          >
            {user ? "Proceed to Checkout" : "Login to Checkout"}
          </button>
          {!user && (
            <p className="text-sm text-center text-gray-600">
              or <a href="/registration" className="text-blue-500">create an account</a>
            </p>
          )}
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default CartPage;