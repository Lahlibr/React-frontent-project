import React, { useState, useEffect } from "react";
import ProductTable from "../components/ProductTable";
import Filters from "./Filters";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductForm from "./ProductForm";
import axiosInstance from "../../components/AxiosInstance";
import { toast } from "react-toastify";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const [originalProducts, setOriginalProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching products...");
      const response = await axiosInstance.get("category/All");
      console.log("API Response:", response.data);
      
      const allProducts = response.data.flatMap((category) =>
        category.products.map((product) => ({
          id: product.productId,
          productName: product.productName,
          category: category.name,
          price: product.realPrice,
          offerPrice: product.offerPrice,
          type: product.type,
          rating: product.rating,
          description: product.description,
          images: product.imageUrl || [],
          isDeleted: product.isDeleted || false,
        }))
      );
      
      console.log("Processed products:", allProducts);
      setOriginalProducts(allProducts);
      setDisplayedProducts(allProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Add user feedback
      alert("Failed to fetch products. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

 const handleSearch = async (searchTerm) => {
  if (!searchTerm) {
    setDisplayedProducts(originalProducts);
    return;
  }

  try {
    const response = await axiosInstance.get(`Product/Search/${searchTerm}`);
    const filteredProducts = response.data.map((product) => ({
      id: product.productId,
      productName: product.productName,
      category: product.categoryName || "Unknown", // Adjust as per your API response
      price: product.realPrice,
      offerPrice: product.offerPrice,
      type: product.type,
      rating: product.rating,
      description: product.description,
      images: product.imageUrl || [],
      isDeleted: product.isDeleted || false,
    }));

    setDisplayedProducts(filteredProducts);
  } catch (error) {
    console.error("Search failed:", error);
    toast.error("No matching products found.");
    setDisplayedProducts([]); // Optionally clear the UI
  }
};


  const handleEdit = (product) => {
    console.log("Editing product:", product);
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = async () => {
    console.log("Closing modal and refreshing data...");
    setEditProduct(null);
    setIsModalOpen(false);
    
    // Add a small delay to ensure server has processed the update
    setTimeout(() => {
      fetchProducts();
    }, 500);
  };

  const handleRemove = async (id) => {
  try {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    await axiosInstance.delete(`Product/Delete/${id}`); // Assuming baseURL is already set

    console.log(`Product ${id} deleted from server`);
    toast.success("Product deleted successfully");

    fetchProducts(); // Refresh product list
  } catch (error) {
    console.error("Error deleting product:", error);
    toast.error("Failed to delete product");
  }
};


  // Create a custom ProductForm wrapper that handles the close callback
  const ProductFormWrapper = ({ editProduct, onClose }) => {
    const handleFormClose = () => {
      console.log("ProductForm closed, refreshing data...");
      onClose();
    };

    return (
      <ProductForm 
        editProduct={editProduct} 
        onClose={handleFormClose}
      />
    );
  };

  return (
    <>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <div
          className={`fixed md:relative z-40 w-64 bg-gray-800 text-white md:block ${
            sidebarOpen ? "translate-x-0" : "-translate-x-64"
          } transition-transform duration-300 md:translate-x-0`}
        >
          <Sidebar
            isOpen={sidebarOpen}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        <div className="flex-1 min-h-screen bg-white text-black p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold">Products</h1>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                onClick={() => setIsModalOpen(true)}
                disabled={isLoading}
              >
                + Add Product
              </button>
            </div>

            <Filters onSearch={handleSearch} />

            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading products...</p>
              </div>
            ) : (
              <ProductTable
                products={displayedProducts.filter((p) => !p.isDeleted)}
                handleRemove={handleRemove}
                handleEdit={handleEdit}
              />
            )}

            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <ProductFormWrapper
                editProduct={editProduct}
                onClose={closeModal}
              />
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;