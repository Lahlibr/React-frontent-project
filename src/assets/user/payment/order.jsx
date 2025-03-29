import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 flex justify-center">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Your Orders</h2>
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={index} className="border p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center border-b pb-3 mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">Order #{order.id}</h3>
                  <span className={`px-3 py-1 text-sm font-bold rounded ${order.status === "Paid" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>{order.status}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600"><strong>Name:</strong> {order.username}</p>
                    <p className="text-gray-600"><strong>Email:</strong> {order.email}</p>
                    <p className="text-gray-600"><strong>Address:</strong> {order.address}</p>
                  </div>
                  <div className="border p-3 rounded bg-gray-50">
                    <h4 className="font-semibold text-gray-700">Order Summary</h4>
                    <p className="text-gray-600">Subtotal: ₹{order.subtotal}</p>
                    <p className="text-gray-600">Discount: ₹{order.discount}</p>
                    <p className="text-gray-600">Tax: ₹{order.tax}</p>
                    <p className="text-lg font-bold text-gray-900">Total: ₹{order.totalPrice}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Products:</h4>
                  <ul className="border rounded bg-gray-50 p-3 space-y-2">
                    {order.products.map((product, i) => (
                      <li key={i} className="flex justify-between border-b pb-2">
                        <span>{product.name} (x{product.quantity})</span>
                        <span className="font-bold text-green-500">₹{product.quantity * product.new_price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 border rounded">
                  <h4 className="font-semibold text-gray-700 mb-2">Payment Information</h4>
                  <p className="text-gray-600">Payment Method: {order.paymentMethod}</p>
                  <p className="text-gray-600">Transaction ID: {order.transactionId}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No orders found.</p>
        )}
        <div className="mt-6 text-center">
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">Done</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
