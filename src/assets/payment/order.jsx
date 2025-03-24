import React, { useEffect, useState } from "react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Your Orders</h2>
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={index} className="border p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">Order #{index + 1}</h3>
                <p className="text-gray-600"><strong>Name:</strong> {order.username}</p>
                <p className="text-gray-600"><strong>Email:</strong> {order.email}</p>
                <p className="text-gray-600"><strong>Address:</strong> {order.address}</p>
                <div className="mt-3">
                  <h4 className="font-semibold text-gray-700">Products:</h4>
                  <ul className="space-y-2">
                    {order.products.map((product, i) => (
                      <li key={i} className="flex justify-between border-b pb-2">
                        <span>{product.name} (₹{product.qty})</span>
                        <span className="font-bold text-green-500">₹{(order.totalPrice) *  product.qty}</span>
                      </li>
                    ))} 
                  </ul>
                  {console.log(JSON.parse(localStorage.getItem("orders")))}
                </div>
                <div className="flex justify-between text-xl font-bold mt-4">
      <span>Total Price:</span>
      <span className="text-green-500">₹{order.totalPrice}</span>
    </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No orders found.</p>
        )}
       
      </div>
    </div>
  );
};

export default OrderList;
