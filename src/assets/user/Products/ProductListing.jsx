// pages/ProductListing.jsx
import React, { useState, useEffect, memo } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";
import NavItems from "../components/NavItems";
import Footer from "../components/Footer";

const ProductListing = memo(() => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const category = new URLSearchParams(location.search).get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/catego"); // Ensure the correct URL
        console.log("Fetched Data:", data); // Debugging
  
        const allProducts = data.categories.flatMap(c => 
          c.products.map(p => ({ ...p, category: c.name }))
        );
        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  

  const filteredProducts = category 
    ? products.filter(p => p.category === category) 
    : products;

  if (isLoading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  return (
    <>
      <NavItems />
      <section className="w-full pt-20 min-h-screen py-12 px-6 bg-black text-white">
        <h2 className="text-3xl font-bold text-center mb-8">
          {category || "All Products"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
});

export default ProductListing;