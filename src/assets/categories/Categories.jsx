import { Link } from "react-router-dom"; 
import React from "react";

const categories = [
  { name: "Burgers", img: "images/burger-14.jpg" },
  { name: "Pizza", img: "images/OIP.jpeg" },
  { name: "Desserts", img: "images/OIP1.jpeg" },
  { name: "Pasta", img: "images/Pasta.jpeg" },
  { name: "Salads", img: "images/Salad.jpeg" },
  { name: "Sushi", img: "images/Sushi.jpeg" },
  { name: "Steaks", img: "images/steak.avif" },
  { name: "Drinks", img: "images/drinks.jpeg" },
  { name: "Seafood", img: "images/seafood.jpeg" },
];

const Categories = () => {
  return (
    <section className="w-full  py-12 px-6 bg-black text-center">
      <h2 className="text-3xl font-bold text-white mb-8">Popular Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
        {categories.map((category, index) => (
          <div key={index} className="bg-white shadow-lg p-4 rounded-lg hover:shadow-xl transition">
            <img src={category.img} alt={category.name} className="w-full rounded-lg h-65" />
            <h3 className="text-xl font-semibold mt-4">{category.name}</h3>
            <Link to={`/products?category=${category.name}`}>
            <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              View More
            </button></Link>
          </div>
        ))}
      </div>
    </section>
  );
};
export { categories };
export default Categories;
