import React, { useState } from "react";
import { Menu, X, Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import SearchComponent from "./Search";
const NavItems = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 border-1 p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src="images/pngtree-food-logo-png-image_5687686.png" alt="Logo" className="h-8 w-8" />
          <h1 className="text-white text-xl font-bold">Foodies</h1>
        </div>
        <SearchComponent/>
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/wishlist"><Heart size={20} className="text-white hover:text-red-400" /></Link>
          <Link to="/cart"><ShoppingCart size={20} className="text-white hover:text-yellow-400" /></Link>
          {user ? (
            <button onClick={handleLogout} className="bg-black text-green-400 font-bold py-2 px-4 rounded hover:bg-blue-400 border-2">Logout</button>
          ) : (
            <Link to="/login" className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600">Login</Link>
          )}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white focus:outline-none">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900 p-4 shadow-lg transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform md:hidden`}>
        <button onClick={() => setIsOpen(false)} className="text-white mb-4"><X size={24} /></button>
        <Link to="/wishlist" className="block text-white py-2">Wishlist</Link>
        <Link to="/cart" className="block text-white py-2">Cart</Link>
        {user ? (
          <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left bg-black text-green-400 font-bold py-2 px-4 rounded hover:bg-blue-400 border-2">Logout</button>
        ) : (
          <Link to="/login" className="block bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 text-center">Login</Link>
        )}
      </div>
    </header>
  );
};
export default NavItems;
