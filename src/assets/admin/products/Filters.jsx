import React,{useState,useEffect} from "react";
import axios from 'axios';
const Filters = ({product}) => {
  
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <input
        type="text"
        placeholder="Search products"
        className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none w-full md:w-1/3"
      />
      <select className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none">
        <option>{product}</option>
      </select>
      
      <button className="bg-gray-700 text-white px-4 py-2 rounded-lg">More Filters</button>
      
    </div>
  );
};

export default Filters;
