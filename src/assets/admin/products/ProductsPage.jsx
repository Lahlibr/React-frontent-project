import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import axios from "axios";
import ProductTable from "../components/ProductTable";
import Filters from "./Filters";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductForm from "./ProductForm";

const ProductsPage = () => {
  const [originalProducts, setOriginalProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/categories");
      const allProducts = response.data.flatMap((category) =>
        category.products.map((product) => ({
          id: product.id,
          title: product.name,
          category: category.name,
          price: product.new_price,
          offerPrice: product.old_price,
          type: product.type,
          rating: product.rating,
          description: product.description,
          images: product.img,
          isDeleted: product.isDeleted || false
        }))
      );
      setOriginalProducts(allProducts);
      setDisplayedProducts(allProducts); 
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Handle search functionality
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setDisplayedProducts(originalProducts);
      return;
    }

    const lowerCaseTerm = searchTerm.toLowerCase();
    const filtered = originalProducts.filter((product) => {
      return (
        (product.title && product.title.toLowerCase().includes(lowerCaseTerm)) ||
        (product.category && product.category.toLowerCase().includes(lowerCaseTerm)) 
      );
    });

    setDisplayedProducts(filtered);
  };

  // Handle product edit
  const handleEdit = (product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

 
  const closeModal = () => {
    setEditProduct(null);
    setIsModalOpen(false);
    fetchProducts(); // Refresh the product list
  };

  // Handle product removal (soft delete)
  const handleRemove = async (id) => {
    try {
      const response = await axios.get("http://localhost:3001/categories");
      const categories = response.data;

      // Find the product in categories
      let categoryToUpdate = null;
      let productIndex = -1;
      
      for (const category of categories) {
        productIndex = category.products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
          categoryToUpdate = category;
          break;
        }
      }

      if (categoryToUpdate && productIndex !== -1) {
        // Update the product's isDeleted flag
        categoryToUpdate.products[productIndex].isDeleted = true;
        
        // Save the updated category
        await axios.put(
          `http://localhost:3001/categories/${categoryToUpdate.id}`,
          categoryToUpdate
        );

        // Update local state
        setOriginalProducts(prev => 
          prev.map(p => p.id === id ? { ...p, isDeleted: true } : p)
        );
        setDisplayedProducts(prev => 
          prev.map(p => p.id === id ? { ...p, isDeleted: true } : p)
        );

        console.log(`Product ${id} marked as deleted`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <div
          className={`fixed md:relative z-50 md:z-auto w-64 bg-gray-900 text-white md:block ${
            sidebarOpen ? "translate-x-0" : "-translate-x-64"
          } transition-transform duration-300 md:translate-x-0`}
        >
          <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        <div className="flex-1 min-h-screen bg-gray-900 text-white p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold">Products</h1>
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={() => setIsModalOpen(true)}
              >
                + Add Product
              </button>
            </div>

            {/* Pass the search handler to Filters */}
            <Filters onSearch={handleSearch} />

            {/* Show the filtered products */}
            <ProductTable 
              products={displayedProducts.filter(p => !p.isDeleted)} 
              handleRemove={handleRemove} 
              handleEdit={handleEdit} 
            />

            <Modal isOpen={isModalOpen} onClose={closeModal}>
              {editProduct ? (
                <ProductForm editProduct={editProduct} onClose={closeModal} />
              ) : (
                <ProductForm onClose={closeModal} />
              )}
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;