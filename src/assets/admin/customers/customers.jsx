import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useTable, useSortBy } from "react-table";
import SearchBar from "../components/SearchBar";
import Table from "../components/ReactTable"; // Ensure this is correctly exported as default
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axiosInstance from "../../components/AxiosInstance";

const CustomerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Unified data fetch using axiosInstance
  const fetchData = async (url, setData) => {
    try {
      const response = await axiosInstance.get(url);
      setData(response.data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  useEffect(() => {
    fetchData("/User/Admin", setUsers);
    fetchData("/Order/Admin/Orders", setOrders);
  }, []);

  const toggleBlockUser = useCallback(
    async (email) => {
      const currentUser = users.find((user) => user.email === email);
      if (!currentUser) {
        console.error(`User with email ${email} not found`);
        return;
      }

      try {
        const response = await axiosInstance.post(
          `/User/block-unblock/${currentUser.id}`
        );
        const updatedUser = response.data;

        // Update user in local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          )
        );

        console.log(
          `User ${email} is now ${updatedUser.blocked ? "blocked" : "unblocked"}`
        );
      } catch (error) {
        console.error("Failed to toggle block/unblock:", error);
        alert("Failed to update user block status. Try again.");
      }
    },
    [users]
  );

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [users, searchQuery]
  );

  const data = useMemo(() => {
    return filteredUsers.map((user) => {
      const userOrders = orders.filter((order) => order.email === user.email);
      const totalSpent = userOrders.reduce(
        (sum, order) => sum + Number(order.totalPrice || 0),
        0
      );

      return {
        name: user.username,
        email: user.email,
        orders: userOrders.length,
        totalSpent,
        avatar: `https://i.pravatar.cc/40?u=${user.email}`,
        blocked: user.blocked,
        id: user.id,
      };
    });
  }, [filteredUsers, orders]);

  const columns = useMemo(
    () => [
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
        Cell: ({ value }) => `$${value.toFixed(2)}`,
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
    ],
    [toggleBlockUser]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 py-4 overflow-auto">
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
