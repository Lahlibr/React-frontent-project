import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/categories")
      .then((response) => {
        const products = response.data.flatMap((category) =>
          category.products.map((product, index) => ({
            ...product,
            id: product.id ?? `${category.name}-${index}`, 
          }))
        );
        const selectedProduct = products.find((p) => p.id.toString() === id);
        setProduct(selectedProduct);
      })
      .catch(console.error);
  }, [id]);

  if (!product) return <p className="text-center text-red-500">Product not found</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
      <img src={`/${product.img}`} alt={product.name} className="w-full md:w-1/2 h-96 object-cover" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 my-2">{product.description}</p>
          <p className="text-lg font-bold">
            <span className="text-gray-500 line-through mr-2">₹{product.old_price}</span>
            <span className="text-green-500">₹{product.new_price}</span>
          </p>
          <button className="bg-blue-500 text-white px-6 py-2 mt-4 rounded-lg hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
