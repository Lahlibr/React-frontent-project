import React from "react";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search customers"
        className="p-2 bg-gray-800 text-white border border-gray-600 rounded-md w-full"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
