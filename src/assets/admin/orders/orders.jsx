import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../../components/AxiosInstance";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const tokenData = JSON.parse(sessionStorage.getItem("adminToken"));
        const response = await axiosInstance.get("Order/Admin/Orders", {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.username]) {
      acc[order.username] = [];
    }
    acc[order.username].push(order);
    return acc;
  }, {});

  return (
    <>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex bg-gray-100 min-h-screen">
        {/* Sidebar */}
        <div
          className={`fixed md:relative z-50 md:z-auto w-64 bg-white border-r border-gray-200 md:block ${
            sidebarOpen ? "translate-x-0" : "-translate-x-64"
          } transition-transform duration-300 md:translate-x-0`}
        >
          <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">
          <div className="max-w-full mx-auto bg-white shadow-md rounded-lg p-4 md:p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center md:text-left">
              📦 Order List
            </h2>

            {orders.length === 0 ? (
              <p className="text-gray-500 text-center">No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-gray-900 text-white text-sm uppercase tracking-wider">
                      <th className="p-3 text-left border border-gray-800">Order ID</th>
                      <th className="p-3 text-left border border-gray-800">Customer</th>
                      <th className="p-3 text-left border border-gray-800">Product(s)</th>
                      <th className="p-3 text-left border border-gray-800">Total Price</th>
                      <th className="p-3 text-left border border-gray-800">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(groupedOrders).map(([username, userOrders]) => (
                      <React.Fragment key={username}>
                        <tr className="bg-gray-200 text-gray-700">
                          <td colSpan="5" className="p-3 font-semibold">
                            👤 {username} ({userOrders[0].email})
                          </td>
                        </tr>
                        {userOrders.map((order) => (
                          <tr
                            key={order.orderId}
                            className="border-b border-gray-200 hover:bg-gray-50 transition text-sm text-gray-800"
                          >
                            <td className="p-3 border border-gray-200">{order.orderId}</td>
                            <td className="p-3 border border-gray-200">{order.username}</td>
                            <td className="p-3 border border-gray-200">
                              {order.products
                                .map(
                                  (product, i) =>
                                    `(${i + 1}) ${product.name} - ${product.quantity}`
                                )
                                .join(", ")}
                            </td>
                            <td className="p-3 font-semibold text-green-600 border border-gray-200">
                              ₹{order.totalPrice}
                            </td>
                            <td className="p-3 border border-gray-200 text-sm capitalize">
                              {order.status}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
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
