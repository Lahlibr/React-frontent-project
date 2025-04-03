import React, { useState, useEffect } from "react";
import { Card } from "../components/cart";
import { Users, ShoppingCart, DollarSign } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState({
    users: [],
    categories: [],
    orders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from db.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch the db.json file
        const response = await fetch('/db.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics based on data
  const totalUsers = data.users ? data.users.length : 0;
  const activeUsers = data.users ? data.users.filter(user => !user.deleted && !user.blocked).length : 0;
  const deletedUsers = data.users ? data.users.filter(user => user.deleted).length : 0;
  const blockedUsers = data.users ? data.users.filter(user => user.blocked).length : 0;
  
  const totalOrders = data.orders ? data.orders.length : 0;
  const totalRevenue = data.orders ? data.orders.reduce((sum, order) => sum + order.totalPrice, 0) : 0;
  
  // Extract products from all categories
  const allProducts = data.categories ? data.categories.flatMap(category => category.products || []) : [];
  
  // Sort products by rating to find trending products
  const trendingProducts = [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 5);
  
  // Prepare metrics for display
  const metrics = [
    { title: "Total Users", value: totalUsers, icon: <Users size={20} />, description: "All registered accounts" },
    { title: "Active Users", value: activeUsers, icon: <Users size={20} />, description: "Non-blocked, non-deleted accounts" },
    { title: "Total Orders", value: totalOrders, icon: <ShoppingCart size={20} />, description: "Orders processed" },
    { title: "Total Revenue", value: `$${totalRevenue}`, icon: <DollarSign size={20} />, description: "Revenue generated" },
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error loading data: {error}</div>;
  }

  return (
    <>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen">
          {/* Summary Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border-r border-gray-200">
                  <h3 className="text-gray-500 text-sm">TOTAL USERS</h3>
                  <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
                  <div className="text-sm text-gray-500 flex justify-center space-x-2 mt-1">
                    <span className="text-green-500">{activeUsers} active</span>
                    <span className="text-red-500">{deletedUsers} deleted</span>
                    <span className="text-orange-500">{blockedUsers} blocked</span>
                  </div>
                </div>
                <div className="text-center p-4 border-r border-gray-200">
                  <h3 className="text-gray-500 text-sm">TOTAL ORDERS</h3>
                  <p className="text-3xl font-bold text-blue-600">{totalOrders}</p>
                  <p className="text-sm text-gray-500">Processed orders</p>
                </div>
                <div className="text-center p-4">
                  <h3 className="text-gray-500 text-sm">TOTAL REVENUE</h3>
                  <p className="text-3xl font-bold text-blue-600">${totalRevenue}</p>
                  <p className="text-sm text-gray-500">Sales revenue</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            {metrics.map((metric, index) => (
              <Card key={index} className="p-4 flex items-center gap-4 shadow-md bg-white rounded-lg">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">{metric.icon}</div>
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <p className="text-lg font-bold">{metric.value}</p>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </div>
              </Card>
            ))}
          </div>
          
          {/* User Status Breakdown */}
          <Card className="p-6 shadow-md bg-white rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">User Status Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="text-green-700 font-medium">Active Users</h3>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
                <p className="text-sm text-green-600">{totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}% of total</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <h3 className="text-red-700 font-medium">Deleted Users</h3>
                <p className="text-2xl font-bold text-red-600">{deletedUsers}</p>
                <p className="text-sm text-red-600">{totalUsers > 0 ? Math.round((deletedUsers / totalUsers) * 100) : 0}% of total</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <h3 className="text-orange-700 font-medium">Blocked Users</h3>
                <p className="text-2xl font-bold text-orange-600">{blockedUsers}</p>
                <p className="text-sm text-orange-600">{totalUsers > 0 ? Math.round((blockedUsers / totalUsers) * 100) : 0}% of total</p>
              </div>
            </div>
          </Card>
          
          {/* Trending Products Section */}
          <Card className="p-6 shadow-md bg-white rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Trending Products</h2>
              <button className="text-blue-600 text-sm">View All</button>
            </div>
            {trendingProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trendingProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={Array.isArray(product.img) ? product.img[0] : product.img} alt={product.name} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${product.new_price}</div>
                          {product.old_price && (
                            <div className="text-xs text-gray-500 line-through">${product.old_price}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.type === "Veg" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {product.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">⭐ {product.rating}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No trending products found</p>
            )}
          </Card>
          
          {/* Recent Orders Section */}
          <Card className="p-6 shadow-md bg-white rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <button className="text-blue-600 text-sm">View All</button>
            </div>
            {data.orders && data.orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.username}</div>
                          <div className="text-xs text-gray-500">{order.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.products.length} items</div>
                          <div className="text-xs text-gray-500">
                            {order.products.map(p => p.name).join(', ').length > 20
                              ? `${order.products.map(p => p.name).join(', ').substring(0, 20)}...`
                              : order.products.map(p => p.name).join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">${order.totalPrice}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-green-600 hover:text-green-900">Process</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No orders found</p>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;