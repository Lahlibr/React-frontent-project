import React, { useState, useEffect, useCallback, useContext } from "react";
import Modal from "./Modal";
import ProductTable from "../components/ProductTable";
import Filters from "./Filters";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductForm from "./ProductForm";
import { ProductContext } from "../../components/ProductContext";

const ProductsPage = () => {
  const { categories, loading, error, deleteProduct, clearError } = useContext(ProductContext);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Update products when categories change
  useEffect(() => {
    if (categories && categories.length > 0) {
      const allProducts = categories.flatMap((category) =>
        category.products
          .filter(product => !product.isDeleted) // Filter out deleted products
          .map((product) => ({
            id: product.id || product.productId,
            productName: product.productName || product.productName,
            category: category.name,
            price: product.new_price || product.realPrice,
            offerPrice: product.old_price || product.offerPrice,
            type: product?.type,
            rating: product.rating,
            description: product.description,
            images: product?.img || product?.imageUrl,
            isDeleted: product.isDeleted || false
          }))
      );
      setOriginalProducts(allProducts);
      setDisplayedProducts(allProducts);
    }
  }, [categories]);

  // Handle search functionality
  const handleSearch = useCallback((searchTerm) => {
    if (!searchTerm) {
      setDisplayedProducts(originalProducts);
      return;
    }

    const lowerCaseTerm = searchTerm.toLowerCase();
    const filtered = originalProducts.filter((product) => {
      return (
        (product.productName && product.productName.toLowerCase().includes(lowerCaseTerm)) ||
        (product.category && product.category.toLowerCase().includes(lowerCaseTerm)) ||
        (product.description && product.description.toLowerCase().includes(lowerCaseTerm))
      );
    });

    setDisplayedProducts(filtered);
  }, [originalProducts]);

  // Handle product edit
  const handleEdit = useCallback((product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setEditProduct(null);
    setIsModalOpen(false);
  }, []);

  // Handle product removal
  const handleRemove = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const success = await deleteProduct(id);
      if (success) {
        // Products will be automatically updated through context
        console.log(`Product ${id} deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }, [deleteProduct]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const openAddModal = useCallback(() => {
    setEditProduct(null);
    setIsModalOpen(true);
  }, []);

  const handleFormSuccess = useCallback(() => {
    // Context will automatically refresh data
    console.log("Product operation completed successfully");
  }, []);

  // Handle error dismissal
  const handleErrorDismiss = useCallback(() => {
    clearError();
  }, [clearError]);

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex">
        <div
          className={`fixed md:relative z-50 md:z-auto w-64 bg-gray-900 text-white md:block ${
            sidebarOpen ? "translate-x-0" : "-translate-x-64"
          } transition-transform duration-300 md:translate-x-0`}
        >
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        <div className="flex-1 min-h-screen bg-gray-900 text-white p-6">
          <div className="max-w-6xl mx-auto">
            {error && (
              <div className="bg-red-600 text-white p-4 rounded mb-4 flex justify-between items-center">
                <span>{error}</span>
                <button 
                  onClick={handleErrorDismiss}
                  className="ml-2 text-red-200 hover:text-white font-bold text-lg"
                >
                  ×
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold">Products</h1>
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-blue-400"
                onClick={openAddModal}
                disabled={loading}
              >
                + Add Product
              </button>
            </div>

            <Filters onSearch={handleSearch} />

            {loading && (
              <div className="text-center py-4">
                <span className="text-gray-400">Loading...</span>
              </div>
            )}

            <ProductTable 
              products={displayedProducts} 
              handleRemove={handleRemove} 
              handleEdit={handleEdit}
              loading={loading}
            />

            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <ProductForm 
                editProduct={editProduct} 
                onClose={closeModal}
                onSuccess={handleFormSuccess}
              />
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;