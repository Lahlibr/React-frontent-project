import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../components/AxiosInstance";

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch products once on mount
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found, skipping category fetch.");
    return;
  }

  axiosInstance.get("Category/All", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      const categories = response.data;
      setProducts(
        categories.flatMap((category) =>
          category.products.map((product) => ({
            ...product,
            category: category.name || "uncategorized",
          }))
        )
      );
    })
    .catch((err) => {
      console.error("Error fetching products:", err);
    });
}, []);


  
  const handleSearch = useCallback((query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    setSearchResults(
      products.filter((product) => {
        // Skip products without names
        if (!product.productName) return false;
        
        const nameMatch = product.productName.toLowerCase().includes(lowerQuery);
        const categoryMatch = product.category 
          ? product.category.toLowerCase().includes(lowerQuery)
          : false;
        
        return nameMatch || categoryMatch;
      })
    );
  }, [products]);

  // Handle input change with debounce effect
  useEffect(() => {
    const delaySearch = setTimeout(() => handleSearch(searchQuery), 300); // 300ms debounce
    return () => clearTimeout(delaySearch);
  }, [searchQuery, handleSearch]);

  return (
    <div className="relative w-64 md:w-80">
      <form className="flex items-center bg-white rounded-lg p-1 shadow-md">
        <input
          type="text"
          placeholder="Search products..."
          className="px-3 py-1 outline-none w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="button" className="p-2 text-gray-600 hover:text-black">
          <Search size={20} />
        </button>
      </form>

      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-y-auto z-50 border border-gray-300">
          {searchResults.map((product) => (
            <div
              key={product.productId}
              className="p-2 hover:bg-gray-200 cursor-pointer flex justify-between"
              onClick={() => navigate(`/product/${product.productId}`)}
            >
              <span className="font-medium">{product.name}</span>
              <span className="text-gray-500 text-sm">{product.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
