import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaMapMarkerAlt, FaUser, FaMoneyBillWave } from "react-icons/fa";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      alert("Please log in to proceed to checkout.");
      navigate("/login");
      return;
    }
    setUser(userData);

    const storedCart = JSON.parse(localStorage.getItem(`cart_${userData.email}`)) || [];
    setCart(storedCart);
    setTotal(storedCart.reduce((sum, item) => sum + item.new_price, 0));
  }, [navigate]);

  const handlePayment = () => {
    const options = {
      key: "mock_razorpay_key",
      amount: total * 100,
      currency: "INR",
      name: "My Store",
      description: "Test Transaction",
      image: "https://example.com/logo.png",
      handler: (response) => {
        alert("Payment Successful: " + response.razorpay_payment_id);
        
        // Get existing orders or create a new array
        let existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
  
        // Create new order object
        const newOrder = {
          username: user.username,
          email: user.email,
          address: "123, Street Name, City", // Replace with actual user input if needed
          products: cart.map((item) => ({
            name: item.name,
            qty: item.qty,
            price: item.new_price || item.price,
          })),totalPrice: total,
        };
  
        // Save order in localStorage
        existingOrders.push(newOrder);
        localStorage.setItem("orders", JSON.stringify(existingOrders));
  
        // Clear cart and navigate to orders
        localStorage.removeItem(`cart_${user.email}`);
        navigate("/orders");
      },
      prefill: {
        name: user?.username || "",
        email: user?.email || "",
      },
      theme: { color: "#4CAF50" },
    };
  
    const mockRazorpay = {
      open: () => setTimeout(() => options.handler({ razorpay_payment_id: "mock_payment_id_12345" }), 1000),
    };
  
    mockRazorpay.open();
  };
  

  return (
    <div className="min-h-screen flex flex-col md:flex-row justify-center items-center bg-gradient-to-r from-blue-50 to-indigo-100 p-6">
      {/* Left Side: User Info & Delivery Details */}
      <div className="hidden md:flex flex-col bg-white/70 backdrop-blur-lg p-6 shadow-xl rounded-lg w-1/3 space-y-6 border border-white">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <FaUser className="text-blue-500" /> Shipping Details
        </h2>
        {user && (
          <div className="bg-gray-100 p-4 rounded-lg space-y-2 text-gray-700 shadow-md">
            <p className="flex items-center gap-2"><FaUser className="text-gray-500" /> {user.name}</p>
            <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-red-500" /> 123, Street Name, City</p>
          </div>
        )}
        <div className="bg-blue-100 p-4 rounded-lg text-gray-700 shadow-md">
          <p className="font-semibold"><FaMoneyBillWave className="text-green-500 inline mr-2" />Estimated Delivery: 3-5 Business Days</p>
        </div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/1584/1584895.png"
          alt="Delivery Truck"
          className="w-40 h-40 mx-auto opacity-80 animate-bounce"
        />
      </div>

      {/* Right Side: Cart & Payment */}
      <div className="w-full md:w-2/3 bg-white/80 backdrop-blur-lg p-6 shadow-xl rounded-lg border border-white">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <FaShoppingCart className="text-blue-500" /> Checkout
        </h1>

        {cart.length > 0 ? (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between p-2 border-b text-lg text-gray-800">
                  <span>{item.name}</span>
                  <span className="font-semibold text-green-600">₹{item.new_price}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-2xl font-bold mt-4">
              <span>Total</span>
              <span className="text-green-500">₹{total}</span>
            </div>
            <button
              onClick={handlePayment}
              className="mt-6 w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-lg hover:scale-105 transform transition duration-300 shadow-lg"
            >
              Pay Now 💳
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/102/102661.png"
              alt="Empty Cart"
              className="w-40 h-40 mb-4"
            />
            <p className="text-gray-500 text-lg">Your cart is empty.</p>
            <Link
              to="/products"
              className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Shop Now 🛒
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
