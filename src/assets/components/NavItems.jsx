import React, { useState, useEffect } from "react";
import { Menu, X, Heart, ShoppingCart, Search } from "lucide-react";

const NavItems = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
  };

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="p-4 w-full">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img
              src="src/assets/components/pngtree-food-logo-png-image_5687686.png"
              alt="Logo"
              className="h-8 w-8"
            />
            <h1 className="text-white text-xl font-bold">Al-Food</h1>
          </div>

          {/* Search Bar - Always Visible */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white rounded-lg p-1 shadow-md w-40 md:w-64 lg:w-80"
          >
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1 border-none outline-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="p-2 text-gray-600 hover:text-black">
              <Search size={20} />
            </button>
          </form>

          {/* Desktop Navbar */}
          <div className="hidden md:flex space-x-6 items-center">
            <button className="text-white hover:text-red-400">
              <Heart size={20} />
            </button>
            <button className="text-white hover:text-yellow-400">
              <ShoppingCart size={20} />
            </button>
            <a
              href="/login"
              className="bg-black text-green-400 font-bold py-2 px-4 rounded hover:bg-blue-400 border-2"
            >
              Login
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Smooth Slide In */}
        <div
          className={`fixed top-0 left-0 h-full w-3/4 bg-black p-6 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out md:hidden`}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="text-white absolute top-4 right-4"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col space-y-6 mt-12">
            <button className="text-white hover:text-red-400 flex items-center">
              <Heart size={20} className="mr-2" /> Wishlist
            </button>
            <button className="text-white hover:text-yellow-400 flex items-center">
              <ShoppingCart size={20} className="mr-2" /> Cart
            </button>
            <a
              href="/login"
              className="bg-black text-green-400 font-bold py-2 px-4 rounded hover:bg-blue-400 border-2 text-center"
            >
              Login
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavItems;
