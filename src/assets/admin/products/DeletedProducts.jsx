import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../../components/ProductContext";
import axios from "axios";
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import { toast } from "react-toastify";

const DeletedProductsPage = () => {
  const { categories, refreshCategories } = useContext(ProductContext);
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeletedProducts = () => {
      try {
        const allDeletedProducts = categories.flatMap(category => 
          category.products
            .filter(product => product.isDeleted)
            .map(product => ({
              ...product,
              categoryId: category.id,
              categoryName: category.name,
              productName: product.title || product.name,
              price: product.price || product.new_price
            }))
        );
        
        setDeletedProducts(allDeletedProducts);
      } catch (error) {
        console.error("Error fetching deleted products:", error);
        toast.error("Failed to load deleted products");
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedProducts();
  }, [categories]);

  const handlePermanentDelete = async (productId) => {
  if (!window.confirm("Are you sure you want to permanently delete this product?")) return;

  try {
    await axios.delete(`http://localhost:5000/api/products/delete/${productId}`); // Assuming this is your API
    toast.success("Product permanently deleted");

    // Update the UI
    setDeletedProducts(prev => prev.filter(p => p.id !== productId));
    refreshCategories(); // Optional, if needed
  } catch (error) {
    console.error("Error permanently deleting product:", error);
    toast.error("Failed to permanently delete product");
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-xl font-semibold text-white">Loading deleted products...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar - Fixed width and always visible on desktop */}
      <div className={`fixed inset-y-0 z-50 w-64 bg-gray-800 text-white transition-all duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Deleted Products</h1>
            </div>

            {/* Products Table */}
            {deletedProducts.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <p className="text-gray-400">No deleted products found</p>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {deletedProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-750">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{product.productName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">{product.categoryName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">${product.price}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
  onClick={() => handlePermanentDelete(product.id)}
  className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
>
  Delete Permanently
</button>

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DeletedProductsPage;