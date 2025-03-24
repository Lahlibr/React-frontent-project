import React, { useState, useEffect } from "react";
import { Menu, X, Heart, ShoppingCart, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const NavItems = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then(res => res.json())
      .then(categories =>
        setProducts(categories.flatMap(category =>
          category.products.map(product => ({ ...product, category: category.name }))
        ))
      )
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setSearchResults(query
      ? products.filter(product => product.name.toLowerCase().includes(query) || product.category?.toLowerCase().includes(query))
      : []);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-gray-900 p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src="src/assets/components/pngtree-food-logo-png-image_5687686.png" alt="Logo" className="h-8 w-8" />
          <h1 className="text-white text-xl font-bold">Al-Food</h1>
        </div>

        <div className="relative w-64 md:w-80">
          <form className="flex items-center bg-white rounded-lg p-1 shadow-md">
            <input type="text" placeholder="Search products..." className="px-3 py-1 outline-none w-full" value={searchQuery} onChange={handleSearchChange} />
            <button type="button" className="p-2 text-gray-600 hover:text-black"><Search size={20} /></button>
          </form>
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-y-auto z-50 border border-gray-300">
              {searchResults.map((product, index) => (
                <div key={`${product.id}-${index}`} className="p-2 hover:bg-gray-200 cursor-pointer flex justify-between" onClick={() => navigate(`/product/${product.id}`)}>
                  <span className="font-medium">{product.name}</span>
                  <span className="text-gray-500 text-sm">{product.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>

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
