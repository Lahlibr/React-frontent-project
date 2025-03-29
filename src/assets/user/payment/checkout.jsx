import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaShoppingCart, FaMapMarkerAlt, FaUser } from "react-icons/fa";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);

  // Fetch user and cart data
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!userData) {
      alert("Please log in to proceed to checkout.");
      navigate("/login");
      return;
    }

    setUser(userData);

    axios.get(`http://localhost:3001/users/${userData.id}`)
      .then((response) => {
        const fetchedUser = response.data;
        const userCart = fetchedUser.cart || [];

        setCart(userCart);
        setTotal(userCart.reduce((sum, item) => sum + item.new_price * (item.quantity || 1), 0));
      })
      .catch((error) => console.error("Error fetching cart:", error));
  }, [navigate]);

  // Handle Payment (Mock)
  const handlePayment = async () => {
    if (!user || cart.length === 0) return;
  
    const options = {
      key: "mock_razorpay_key",
      amount: total * 100,
      currency: "INR",
      name: "My Store",
      description: "Test Transaction",
      handler: async (response) => {
        alert("Payment Successful: " + response.razorpay_payment_id);
  
        const newOrder = {
          userId: user.id,
          username: user.username,
          email: user.email,
          address: user.address || "123, Street Name, City", // Use user's address
          products: cart,
          totalPrice: total,
          date: new Date().toISOString(),
        };
  
        try {
          // Save order and clear cart in db.json
          await axios.post("http://localhost:3001/orders", newOrder);
          await axios.patch(`http://localhost:3001/users/${user.id}`, { cart: [] });
  
          // Fetch the latest user data from the database
          const updatedResponse = await axios.get(`http://localhost:3001/users/${user.id}`);
          const updatedUser = updatedResponse.data;
  
          // Update local state and localStorage
          setUser(updatedUser);
          setCart([]); // Clear the cart state instantly
          setTotal(0);
          localStorage.setItem("user", JSON.stringify(updatedUser));
  
          // Delay before redirecting to ensure state updates properly
          setTimeout(() => {
            navigate("/orders"); // Redirect to the Orders page
            window.location.reload(); // Refresh the page
          }, 500);
  
        } catch (error) {
          console.error("Error during checkout:", error);
          alert("Checkout failed.");
        }
      },
    };
  
    // Simulate Razorpay payment
    const mockRazorpay = {
      open: () => setTimeout(() => options.handler({ razorpay_payment_id: "mock_payment_id_12345" }), 1000),
    };
  
    mockRazorpay.open();
  };
  
  
  
  

  return (
    <div className="min-h-screen flex flex-col md:flex-row justify-center items-center bg-gradient-to-r from-blue-50 to-indigo-100 p-6">
      {/* User Details */}
      <div className="hidden md:flex flex-col bg-white/70 p-6 shadow-xl rounded-lg w-1/3 space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaUser className="text-blue-500" /> Shipping Details
        </h2>
        {user && (
          <div className="bg-gray-100 p-4 rounded-lg space-y-2">
            <p className="flex items-center gap-2"><FaUser className="text-gray-500" /> {user.username}</p>
            <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-red-500" /> 123, Street Name, City</p>
          </div>
        )}
      </div>

      {/* Checkout Summary */}
      <div className="w-full md:w-2/3 bg-white/80 p-6 shadow-xl rounded-lg">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <FaShoppingCart className="text-blue-500" /> Checkout
        </h1>

        {/* If Cart has Items */}
        {cart.length > 0 ? (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between p-2 border-b text-lg">
                  <span>{item.name} (x{item.quantity || 1})</span>
                  <span className="font-semibold text-green-600">₹{item.new_price * (item.quantity || 1)}</span>
                </div>
              ))}
            </div>

            {/* Total Price */}
            <div className="flex justify-between text-2xl font-bold mt-4">
              <span>Total</span>
              <span className="text-green-500">₹{total}</span>
            </div>

            {/* Payment Button */}
            <button onClick={handlePayment} className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg hover:scale-105 transition">
              Pay Now 💳
            </button>
          </>
        ) : (
          // If Cart is Empty
          <div className="flex flex-col items-center text-center">
            <img src="https://cdn-icons-png.flaticon.com/512/102/102661.png" alt="Empty Cart" className="w-40 h-40 mb-4" />
            <p className="text-gray-500 text-lg">Your cart is empty.</p>
            <Link to="/products" className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg">Shop Now 🛒</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
