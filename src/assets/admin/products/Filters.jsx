import React, { useState } from "react";

const Filters = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Pass the search term up to the parent
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <input
        type="text"
        placeholder="Search products..."
        className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none w-full md:w-1/3"
        value={searchTerm}
        onChange={handleSearch}
      />
      <select className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none">
        <option value="">All Categories</option>
        {/* Add category options here if needed */}
      </select>
      <button className="bg-gray-700 text-white px-4 py-2 rounded-lg">
        More Filters
      </button>
    </div>
  );
};

export default Filters;