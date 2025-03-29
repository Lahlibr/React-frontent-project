import React from "react";
import { FaBars, FaTimes, FaShoppingCart, FaClipboardList, FaCog, FaUser, FaUsers, FaKey, FaSearch } from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-gray-900 text-white">
      {/* Sidebar Toggle Button */}
      <button className="md:hidden" onClick={toggleSidebar}>
        <FaBars size={24} />
      </button>
      
      {/* Navbar Title */}
      <h1 className="text-white font-bold text-lg">Dashboard</h1>
      
      {/* Navbar Items */}
      <div className="flex items-center space-x-4 w-full md:w-auto">
        
        {/* Search Bar */}
        <div className="relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-gray-800 text-white px-3 py-1 rounded-lg w-full focus:outline-none"
          />
          <FaSearch className="absolute right-3 top-2 text-gray-400" />
        </div>
        
        {/* Profile Image */}
        <img 
          src="https://randomuser.me/api/portraits/men/1.jpg" 
          alt="Profile" 
          className="w-8 h-8 rounded-full border border-gray-700" 
        />
      </div>
    </nav>
  );
};

export default Navbar;