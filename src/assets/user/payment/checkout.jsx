import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaMapMarkerAlt,
  FaUser,
  FaTrash,
} from "react-icons/fa";
import axiosInstance from "../../components/AxiosInstance";
import AddAddressForm from "./AddressForm";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const formatAddress = (addr) => {
    return `${addr.houseName}, ${addr.landmark}, ${addr.place}, ${addr.postOffice}, ${addr.pincode}`;
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      alert("Please log in to proceed to checkout.");
      navigate("/login");
      return;
    }
    setUser(userData);
    fetchCart();
    fetchAddresses();
  }, []);

  useEffect(() => {
    setTotal(cart.reduce((sum, item) => sum + item.offerPrice * (item.quantity || 1), 0));
  }, [cart]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get("/Cart/GetCartItems");
      setCart(response?.data?.data?.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get("/Address/All", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const fetched = response?.data?.data || [];
      setAddresses(fetched);
      setSelectedAddress(fetched[0] || null);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  const handleAddressDelete = async (addressId) => {
    try {
      await axiosInstance.delete(`/Address/${addressId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAddresses((prev) => prev.filter((a) => a.addressId !== addressId));
      if (selectedAddress?.addressId === addressId) setSelectedAddress(null);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handlePayment = async () => {
    if (!user || cart.length === 0 || !selectedAddress) {
      alert("Please select or add a shipping address.");
      return;
    }

    const options = {
      key: "rzp_test_cKEFhcQa34jw5p",
      amount: total * 100,
      currency: "INR",
      name: "My Store",
      description: "Test Transaction",
      handler: async function (response) {
        const newOrder = {
          userId: user.id,
          addressId: selectedAddress.addressId,
        };
        try {
          await axiosInstance.post("/Order/Place", newOrder, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          alert("Order placed successfully!");
          navigate("/orders");
        } catch (error) {
          console.error("Failed to place order:", error);
          alert("Something went wrong while placing the order.");
        }
      },
      prefill: {
        name: user.username,
        email: user.email,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleAddressAdded = (newAddr) => {
    setShowAddressForm(false);
    fetchAddresses();
    setSelectedAddress(newAddr);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row justify-center items-start gap-6 bg-gradient-to-r from-blue-50 to-indigo-100 p-6">
      {/* Address Section */}
      <div className="bg-white/70 p-6 shadow-xl rounded-lg w-full md:w-1/3 space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaUser className="text-blue-500" /> Shipping Details
        </h2>

        {user && (
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="flex items-center gap-2 mb-2">
                <FaUser className="text-gray-500" /> {user.username}
              </p>

              {selectedAddress && (
                <div className="flex justify-between items-center">
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <FaMapMarkerAlt className="text-red-500" />
                    {formatAddress(selectedAddress)}
                  </p>
                  <FaTrash
                    className="text-red-600 cursor-pointer"
                    onClick={() => handleAddressDelete(selectedAddress.addressId)}
                  />
                </div>
              )}

              <select
                value={selectedAddress?.addressId || ""}
                onChange={(e) =>
                  setSelectedAddress(addresses.find((a) => a.addressId === parseInt(e.target.value)))
                }
                className="mt-3 w-full border p-2 rounded"
              >
                {addresses.map((addr) => (
                  <option key={addr.addressId} value={addr.addressId}>
                    {formatAddress(addr)}
                  </option>
                ))}
              </select>

              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="mt-2 text-sm text-blue-500 underline"
                >
                  + Add New Address
                </button>
              )}
            </div>

            {showAddressForm && (
              <AddAddressForm
                onSuccess={handleAddressAdded}
                onCancel={() => setShowAddressForm(false)}
              />
            )}
          </div>
        )}
      </div>

      {/* Order Summary Section */}
      <div className="w-full md:w-2/3 bg-white/80 p-6 shadow-xl rounded-lg">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <FaShoppingCart className="text-blue-500" /> Checkout
        </h1>

        {cart.length > 0 ? (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between p-2 border-b text-lg">
                  <span>{item.productName} (x{item.quantity || 1})</span>
                  <span className="font-semibold text-green-600">
                    ₹{item.offerPrice * (item.quantity || 1)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-2xl font-bold mt-4">
              <span>Total</span>
              <span className="text-green-500">₹{total}</span>
            </div>

            <button
              onClick={handlePayment}
              className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg hover:scale-105 transition"
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
            <Link to="/products" className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg">
              Shop Now 🛒
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
