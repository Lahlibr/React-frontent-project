import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaMapMarkerAlt,
  FaUser,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import axiosInstance from "../../components/AxiosInstance";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [editingAddress, setEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
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
    setTotal(
      cart.reduce((sum, item) => sum + item.offerPrice * (item.quantity || 1), 0)
    );
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
      const items = response?.data?.data?.items || [];
      setCart(items);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get("/Address/All", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Fetched addresses:", response.data);
      const fetchedAddresses = response?.data?.data || [];
      setAddresses(fetchedAddresses);
      setSelectedAddress(fetchedAddresses[0] || null);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  const handleAddressAdd = async () => {
  const newAddressObj = {
    fullName: "John Doe",
    houseName: "My House",
    landmark: "Near Church",
    phoneNumber: "1234567890",
    pincode: "123456",
    place: "Town Name",
    postOffice: "Post Office",
  };

  try {
    const response = await axiosInstance.post("/Address/Add", newAddressObj, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    const added = response?.data?.data;
    if (added) {
      fetchAddresses(); // re-fetch after add
      setNewAddress(""); // if you use a form input
    }
  } catch (error) {
    console.error("Error adding address:", error?.response?.data || error);
  }
};


  const handleAddressDelete = async (addressId) => {
    try {
      await axiosInstance.delete(`/Address/${addressId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
      if (selectedAddress?.id === addressId) setSelectedAddress(null);
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
      key: "mock_razorpay_key",
      amount: total * 100,
      currency: "INR",
      name: "My Store",
      description: "Test Transaction",
      handler: async (response) => {
        const newOrder = {
          userId: user.id,
          username: user.username,
          email: user.email,
          address: selectedAddress.address,
          products: cart,
          subtotal: total,
          discount: 0,
          tax: 0,
          totalPrice: total,
          status: "Paid",
          paymentMethod: "Razorpay (Mock)",
          transactionId: response.razorpay_payment_id,
          date: new Date().toISOString(),
        };

        try {
          await axiosInstance.post("/Order/Place", newOrder, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          alert("Order placed successfully!");
          navigate("/orders");
        } catch (error) {
          console.error("Failed to place order:", error);
          alert("Something went wrong while placing the order.");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row justify-center items-start gap-6 bg-gradient-to-r from-blue-50 to-indigo-100 p-6">
      {/* User Details */}
      <div className="bg-white/70 p-6 shadow-xl rounded-lg w-full md:w-1/3 space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaUser className="text-blue-500" /> Shipping Details
        </h2>

        {user && (
          <div className="bg-gray-100 p-4 rounded-lg space-y-2">
            <p className="flex items-center gap-2">
              <FaUser className="text-gray-500" /> {user.username}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  {selectedAddress?.address || "No address selected"}
                </p>
                {selectedAddress && (
                  <FaTrash
                    className="cursor-pointer text-red-600"
                    onClick={() => handleAddressDelete(selectedAddress.id)}
                  />
                )}
              </div>
             <select
  value={selectedAddress?.addressId || ""}
  onChange={(e) =>
    setSelectedAddress(
      addresses.find((a) => a.addressId === parseInt(e.target.value))
    )
  }
  className="w-full border p-2 rounded"
>
  {addresses.map((addr) => (
    <option key={addr.addressId} value={addr.addressId}>
      {formatAddress(addr)}
    </option>
  ))}
</select>

            </div>

            {editingAddress ? (
              <div className="mt-4 space-y-2">
                <textarea
                  rows={3}
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="Enter new address"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddressAdd}
                    className="bg-green-500 text-white px-4 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingAddress(false)}
                    className="bg-gray-400 text-white px-4 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setEditingAddress(true)}
                className="mt-2 text-sm text-blue-500 underline"
              >
                + Add Address
              </button>
            )}
          </div>
        )}
      </div>

      {/* Checkout Summary */}
      <div className="w-full md:w-2/3 bg-white/80 p-6 shadow-xl rounded-lg">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <FaShoppingCart className="text-blue-500" /> Checkout
        </h1>

        {cart.length > 0 ? (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between p-2 border-b text-lg"
                >
                  <span>
                    {item.productName} (x{item.quantity || 1})
                  </span>
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
            <Link
              to="/products"
              className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg"
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