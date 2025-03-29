import React, { useState, useEffect } from "react";

import { Card } from "../components/cart";
import { BarChart, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, Line } from "recharts";
import { Users, ShoppingCart, DollarSign, TrendingUp, Package } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const data = [
  { name: "Jan", revenue: 4000, sales: 2400 },
  { name: "Feb", revenue: 3000, sales: 1398 },
  { name: "Mar", revenue: 5000, sales: 9800 },
  { name: "Apr", revenue: 2780, sales: 3908 },
  { name: "May", revenue: 1890, sales: 4800 },
];

const metrics = [
  { title: "Registered Users", value: "1,234", icon: <Users size={20} /> },
  { title: "Total Sales", value: "567", icon: <ShoppingCart size={20} /> },
  { title: "Total Sales Amount", value: "$45,678", icon: <DollarSign size={20} /> },
  { title: "Out of Stock", value: "12", icon: <Package size={20} /> },
  { title: "Trending Products", value: "5", icon: <TrendingUp size={20} /> },
];





const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
            {metrics.map((metric, index) => (
              <Card key={index} className="p-4 flex items-center gap-4 shadow-md bg-white rounded-lg">
                <div className="p-3 bg-gray-100 rounded-full">{metric.icon}</div>
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <p className="text-lg font-bold">{metric.value}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 shadow-md bg-white rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-6 shadow-md bg-white rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Weekly Sales Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};


export default AdminDashboard;
