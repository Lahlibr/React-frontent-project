import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from db.json
    axios.get("http://localhost:3001/categories")
      .then((res) => {
        const allProducts = res.data.flatMap(category=>category.products.map(product => ({
          ...product,categoryName: category.name,
        })));
        setProducts(allProducts);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleRemove = async (id) => {
    try {
      // Fetch categories to find the product’s category
      const res = await axios.get("http://localhost:3001/categories");
      const categories = res.data;
  
      // Find the category containing the product
      let categoryIndex = -1;
      let productIndex = -1;
      categories.forEach((category, catIdx) => {
        category.products.forEach((product, prodIdx) => {
          if (product.id === id) {
            categoryIndex = catIdx;
            productIndex = prodIdx;
          }
        });
      });
  
      // If the product is found, update the category
      if (categoryIndex !== -1 && productIndex !== -1) {
        const category = categories[categoryIndex];
        category.products.splice(productIndex, 1); // Remove the product
  
        // Send PUT request to update db.json
        await axios.put(`http://localhost:3001/categories/${category.id}`, category);
  
        // Update state to reflect the changes
        setProducts(products.filter(product => product.id !== id));
  
        console.log(`Product with ID ${id} removed successfully`);
      } else {
        console.error("Product not found");
      }
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Products</h1>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            + Add Product
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products"
            className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none w-full md:w-1/3"
          />
          <select className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none">
            <option>Category</option>
          </select>
          <select className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none">
            <option>Vendor</option>
          </select>
          <button className="bg-gray-700 text-white px-4 py-2 rounded-lg">More Filters</button>
          <button className="bg-gray-700 text-white px-4 py-2 rounded-lg">Export</button>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto bg-gray-800 rounded-lg p-4 shadow-lg">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-3 text-left border-b border-gray-600">Product Name</th>
                <th className="p-3 text-left border-b border-gray-600">Price</th>
                <th className="p-3 text-left border-b border-gray-600">Category</th>
                <th className="p-3 text-left border-b border-gray-600">Vendor</th>
                <th className="p-3 text-left border-b border-gray-600">Published On</th>
                <th className="p-3 text-left border-b border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-600 hover:bg-gray-700 transition">
                    <td className="p-3 flex items-center gap-3">
                      <img src={product.img} alt={product.name} className="w-10 h-10 rounded-lg" />
                      {product.name}
                    </td>
                    <td className="p-3 text-green-400">${product.new_price}</td>
                    <td className="p-3">{product.categoryName}</td>
                    <td className="p-3">{"Lahl ibrahim"}</td>
                    <td className="p-3">{"29-03-25"}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
