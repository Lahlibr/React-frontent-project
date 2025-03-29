import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch orders from db.json
    fetch("/db.json")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  // Group orders by user
  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.username]) {
      acc[order.username] = [];
    }
    acc[order.username].push(order);
    return acc;
  }, {});

  return (
    <>
      {/* Navbar */}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar + Main Content Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed md:relative z-50 md:z-auto w-64 bg-gray-900 text-white md:block ${
            sidebarOpen ? "translate-x-0" : "-translate-x-64"
          } transition-transform duration-300 md:translate-x-0`}
        >
          <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen bg-gray-900 p-4 md:p-6 transition-all">
          <div className="max-w-full mx-auto bg-gray-800 shadow-lg rounded-lg p-4 md:p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 md:mb-6 text-center md:text-left">
              📦 Order List
            </h2>

            {orders.length === 0 ? (
              <p className="text-gray-300 text-center">No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-700 text-white text-xs md:text-sm">
                      <th className="p-2 md:p-3 text-left border border-gray-600">Order ID</th>
                      <th className="p-2 md:p-3 text-left border border-gray-600">Customer</th>
                      <th className="p-2 md:p-3 text-left border border-gray-600">Product</th>
                      <th className="p-2 md:p-3 text-left border border-gray-600">Total Price</th>
                      <th className="p-2 md:p-3 text-left border border-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(groupedOrders).map(([username, userOrders]) => (
                      userOrders.map((order, index) => (
                        <tr
                          key={order.id}
                          className="border-b border-gray-600 hover:bg-gray-700 transition text-xs md:text-sm text-white"
                        >
                          <td className="p-2 md:p-3 border border-gray-600">{order.id}</td>

                          {/* Show username only for the first order of the user */}
                          {index === 0 ? (
                            <td className="p-2 md:p-3 border border-gray-600" rowSpan={userOrders.length}>
                              {username}
                            </td>
                          ) : null}

                          {/* Merge products into one cell */}
                          <td className="p-2 md:p-3 border border-gray-600">
                            {order.products
                              .map((product, i) => `(${i + 1}) ${product.name} - ${product.quantity}`)
                              .join(", ")}
                          </td>

                          <td className="p-2 md:p-3 font-semibold text-green-400 border border-gray-600">
                            ₹{order.totalPrice}
                          </td>
                          <td className="p-2 md:p-3 border border-gray-600">
                            <span
                              className={`px-2 py-1 rounded-lg text-xs md:text-sm text-white ${
                                order.status === "Pending"
                                  ? "bg-yellow-500"
                                  : order.status === "Shipped"
                                  ? "bg-blue-500"
                                  : order.status === "Delivered"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
