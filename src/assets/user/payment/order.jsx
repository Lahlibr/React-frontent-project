import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../components/AxiosInstance";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    console.log("User data from localStorage:", userData);
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchOrders(parsedUser.id);
    } else {
      setFetchError("User not found. Please login.");
      setLoading(false);
    }
  }, []);

  const fetchOrders = (userId) => {
    axiosInstance
      .get(`/Order/UserOrderDetails/${userId}`)
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setFetchError("Failed to load orders. Please try again later.");
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">{fetchError}</p>
        <Link to="/login" className="ml-4 text-blue-600 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 flex justify-center">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        {/* Enhanced User Info Section */}
        <div className="mb-8 text-center border-b pb-6">
          <h2 className="text-3xl font-bold text-blue-600">Your Orders</h2>
          {user && (
            <div className="mt-4">
              <div className="flex justify-center items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold text-gray-800">
                    {user.username}
                  </p>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    {user.role === "Admin" ? "Administrator" : "Customer"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 mb-3 gap-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-bold rounded ${
                      order.status === "Paid" || order.status === "Completed"
                        ? "bg-green-200 text-green-700"
                        : order.status === "Pending"
                        ? "bg-yellow-200 text-yellow-700"
                        : "bg-red-200 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700">Customer Details</h4>
                    <p className="text-gray-600">
                      <span className="font-medium">Name:</span> {order.username || user.username}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span> {order.email || user.email}
                    </p>
                    {order.address && (
                      <p className="text-gray-600">
                        <span className="font-medium">Address:</span> {order.address}
                      </p>
                    )}
                    {order.phone && (
                      <p className="text-gray-600">
                        <span className="font-medium">Phone:</span> {order.phone}
                      </p>
                    )}
                  </div>

                  <div className="border p-3 rounded bg-gray-50">
                    <h4 className="font-semibold text-gray-700 mb-2">Order Summary</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>₹{order.subtotal}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount:</span>
                          <span className="text-red-500">-₹{order.discount}</span>
                        </div>
                      )}
                      {order.tax > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span>₹{order.tax}</span>
                        </div>
                      )}
                      <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                        <span className="text-gray-800">Total:</span>
                        <span className="text-blue-600">₹{order.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products List */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Order Items</h4>
                  <ul className="border rounded divide-y">
                    {(order.products || []).map((product, i) => (
                      <li key={i} className="p-3 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {product.img && (
                              <img
                                src={Array.isArray(product.img) ? product.img[0] : product.img}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">
                                {product.type === "Veg" ? (
                                  <span className="text-green-600">Veg</span>
                                ) : (
                                  <span className="text-red-600">Non-Veg</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-500">
                              ₹{product.quantity * product.new_price}
                            </p>
                            <p className="text-sm text-gray-500">
                              {product.quantity} × ₹{product.new_price}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Payment Information */}
                {order.paymentMethod && (
                  <div className="p-3 bg-gray-50 border rounded">
                    <h4 className="font-semibold text-gray-700 mb-2">Payment Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Method:</span> {order.paymentMethod}
                      </p>
                      {order.transactionId && (
                        <p className="text-gray-600">
                          <span className="font-medium">Transaction ID:</span> {order.transactionId}
                        </p>
                      )}
                      {order.paymentStatus && (
                        <p className="text-gray-600">
                          <span className="font-medium">Status:</span>{" "}
                          <span
                            className={`font-bold ${
                              order.paymentStatus === "Success"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg mb-4">You haven't placed any orders yet.</p>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 inline-block"
            >
              Browse Products
            </Link>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg shadow hover:bg-gray-300 inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderList;