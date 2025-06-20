import { Link } from "react-router-dom"; 
import React, { useState,useEffect } from "react";
import Section4 from "../home/Section4";
import axiosInstance from "../../components/AxiosInstance";
import { normalizeCategory } from "../../components/Normalize";



const Categories = () => {
  const [showAll, setShowAll] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/category/All");
        const data = response.data.categories ||response.data || [];
        const normalizedCategories = data.map(normalizeCategory);
        setCategories(normalizedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
    
  const visibleCategories = showAll ? categories : categories.slice(0, 8);

  return (
    <>
      <section className="w-full py-12 px-6 bg-black text-center">
        <h2 className="text-3xl font-bold text-white mb-8">Popular Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {visibleCategories.map((category, index) => (
            <div key={index} className="bg-white shadow-lg p-4 rounded-lg hover:shadow-xl transition">
              <img src={category.image} alt={category.name} className="w-full rounded-lg h-65" />
              <h3 className="text-xl font-semibold mt-4">{category.name}</h3>
              <Link to={`/products?category=${category.name}`}>
                <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  View More
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {categories.length > 8 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-6 px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        )}
      </section>
      <Section4 />
    </>
  );
};


export default Categories;
