import React, { useState, useEffect, useContext } from "react";
import { ProductContext } from "../../components/ProductContext";
import axios from "axios";

const DeletedProductsPage = () => {
  const { categories, refreshCategories } = useContext(ProductContext);
  const [deletedProducts, setDeletedProducts] = useState([]);

  useEffect(() => {
    // Extract all deleted products from all categories
    const allDeletedProducts = categories.flatMap(category => 
      category.products
        .filter(product => product.isDeleted)
        .map(product => ({
          ...product,
          categoryId: category.id,
          categoryName: category.name
        }))
    );
    
    setDeletedProducts(allDeletedProducts);
  }, [categories]);

  const handleRestore = async (product) => {
    try {
      // Get fresh data for the specific category
      const res = await axios.get(`http://localhost:3001/categories/${product.categoryId}`);
      const category = res.data;
      
      // Find the product in the category
      const productIndex = category.products.findIndex(p => p.id === product.id);
      
      if (productIndex !== -1) {
        // Set isDeleted to false
        category.products[productIndex].isDeleted = false;
        
        // Update the category
        await axios.put(`http://localhost:3001/categories/${category.id}`, category);
        
        // Refresh the data
        refreshCategories();
        
        console.log(`Product with ID ${product.id} restored successfully`);
      }
    } catch (error) {
      console.error("Error restoring product:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Deleted Products</h1>
      
      {deletedProducts.length === 0 ? (
        <p className="text-gray-400">No deleted products found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 text-white border border-gray-700">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deletedProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-700">
                  <td className="px-6 py-4">{product.title || product.name}</td>
                  <td className="px-6 py-4">{product.categoryName}</td>
                  <td className="px-6 py-4">${product.price || product.new_price}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                      onClick={() => handleRestore(product)}
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeletedProductsPage;