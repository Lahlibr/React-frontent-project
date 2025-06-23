import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaTshirt, FaBox, FaShoppingCart, FaClipboardList, FaCog, FaUser, FaUsers, FaKey, FaPlus, FaList } from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [productsOpen, setProductsOpen] = useState(false);

  const menuItems = [
    { name: "Admin Panel", icon: FaKey, path: "/admin-dashboard" },
    { name: "Orders", icon: FaClipboardList, path: "/admin-orders" },
    {
      name: "Products",
      icon: FaBox,
      subItems: [
        { name: "View Products", icon: FaList, path: "/admin-products" },
        { name: "Deleted Products", icon: FaPlus, path: "/admin-deletedProducts" }
      ]
    },
    { name: "Profile", icon: FaUser, path: "/admin-Category" },
    { name: "Profile", icon: FaUser, path: "/admin-Profile" },
    { name: "Users", icon: FaUsers, path: "/admin-customers" },
    
  ];

  return (
    <div className={`fixed inset-y-0 left-0 bg-gray-900 text-white w-64 p-5 transform ${isOpen ? "translate-x-0" : "-translate-x-64"} transition-transform md:translate-x-0`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Foodii</h2>
        <button className="md:hidden" onClick={toggleSidebar}>
          <FaTimes size={20} />
        </button>
      </div>
      <nav className="space-y-4">
        {menuItems.map(({ name, icon: Icon, path, subItems }, index) => (
          <div key={index}>
            {/* Main Menu Item */}
            {subItems ? (
              <div>
                <button
                  onClick={() => setProductsOpen(!productsOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:text-gray-400 transition duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <Icon /> <span>{name}</span>
                  </div>
                  <span>{productsOpen ? "▲" : "▼"}</span>
                </button>
                {/* Submenu Items */}
                {productsOpen && (
                  <div className="ml-6 mt-2 space-y-2">
                    {subItems.map(({ name, icon: SubIcon, path }, subIndex) => (
                      <NavLink
                        key={subIndex}
                        to={path}
                        className={({ isActive }) =>
                          `flex items-center space-x-2 px-3 py-2 rounded-md transition duration-200 ${
                            isActive ? "bg-gray-700 text-yellow-400" : "hover:text-gray-400"
                          }`
                        }
                      >
                        <SubIcon /> <span>{name}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-md transition duration-200 ${
                    isActive ? "bg-gray-700 text-yellow-400" : "hover:text-gray-400"
                  }`
                }
              >
                <Icon /> <span>{name}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
