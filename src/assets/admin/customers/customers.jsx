import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useTable, useSortBy } from "react-table";
import SearchBar from "../components/SearchBar";
import Table from "../components/ReactTable";
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
const fetchData = async (url, setData) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    setData(data);
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
  }
};

const updateUserBlockStatus = async (userId, email, isBlocked) => {
  try {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocked: isBlocked })
    });
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const updatedUser = await response.json();
    console.log("User block status updated:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("Error updating user block status:", error);
    throw error;
  }
};

const CustomerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    fetchData("http://localhost:3001/users", setUsers);
    fetchData("http://localhost:3001/orders", setOrders);
  }, []);
  
  const toggleBlockUser = useCallback(async (email) => {
    const currentUser = users.find(user => user.email === email);
    if (!currentUser) {
      console.error(`User with email ${email} not found in local state`);
      return;
    }
    
    const newBlockedStatus = !currentUser.blocked;
    
    try {
      
      await updateUserBlockStatus(currentUser.id, email, newBlockedStatus);
      
      
      setUsers(prevUsers => {
        return prevUsers.map(user => {
          if (user.email === email) {
            return { ...user, blocked: newBlockedStatus };
          }
          return user;
        });
      });
      
      // Show a toast or some UI feedback
      console.log(`User ${email} ${newBlockedStatus ? 'blocked' : 'unblocked'} successfully`);
    } catch (error) {
      // Handle errors - maybe show a toast or alert to the user
      console.error("Failed to update user block status:", error);
      alert(`Failed to ${currentUser.blocked ? 'unblock' : 'block'} the user. Please try again.`);
    }
  }, [users]);
  
  const filteredUsers = useMemo(() => users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ), [users, searchQuery]);
  
  const data = useMemo(() => filteredUsers.map(user => {
    const userOrders = orders.filter(order => order.email === user.email);
    const totalSpent = userOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    return {
      name: user.username,
      email: user.email,
      orders: userOrders.length,
      totalSpent,
      avatar: `https://i.pravatar.cc/40?u=${user.email}`,
      blocked: user.blocked,
    };
  }), [filteredUsers, orders]);
  
  const columns = useMemo(() => [
    {
      Header: "Customer",
      accessor: "name",
      Cell: ({ row }) => (
        <div className="flex items-center">
          <img 
            src={row.original.avatar} 
            alt={row.original.name} 
            className="w-10 h-10 rounded-full mr-3" 
          />
          <span>{row.original.name}</span>
        </div>
      ),
    },
    { Header: "Email", accessor: "email" },
    { Header: "Orders", accessor: "orders", isNumeric: true },
    {
      Header: "Total Spent",
      accessor: "totalSpent",
      isNumeric: true,
      Cell: ({ value }) => `$${value}`,
    },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <button
          className={`px-3 py-1 rounded ${
            row.original.blocked ? "bg-green-500" : "bg-red-500"
          } text-white`}
          onClick={() => toggleBlockUser(row.original.email)}
        >
          {row.original.blocked ? "Unblock" : "Block"}
        </button>
      ),
    },
  ], [toggleBlockUser]);
  
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);
  
  return (
    <div className="flex h-screen">
    {/* Sidebar with fixed width */}
    <div className="w-64">
      <Sidebar />
    </div>
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />
      <h1 className="text-2xl font-bold mb-4">Customer Dashboard</h1>
      <SearchBar 
        placeholder="Search customers..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
      />
      <Table
        getTableProps={getTableProps}
        getTableBodyProps={getTableBodyProps}
        headerGroups={headerGroups}
        rows={rows}
        prepareRow={prepareRow}
      />
    </div>
    </div>
  );
};

export default CustomerDashboard;