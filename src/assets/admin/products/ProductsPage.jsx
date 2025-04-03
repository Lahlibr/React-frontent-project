import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import axios from "axios";
import ProductTable from "../components/ProductTable";
import Filters from "./Filters";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductForm from "./ProductForm";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    axios
      .get("http://localhost:3001/categories")
      .then((res) => {
        const allProducts = res.data.flatMap((category) =>
          category.products.map((product) => ({
            id: product.id,
            title: product.name,  // ✅ Fix name → title
            category: category.name, // ✅ Add category name for filtering
            price: product.new_price, // ✅ Fix new_price → price
            offerPrice: product.old_price, // ✅ old_price as offerPrice
            type: product.type,
            rating: product.rating,
            description: product.description,
            images: product.img 
          }))
        );
        setProducts(allProducts);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Open modal for editing a product
 const handleEdit = (product) => {
  console.log("Editing Product:", product); // ✅ Debugging log
  setEditProduct(product);
  setIsModalOpen(true);
};
  const closeModal = () => {
    setEditProduct(null);
    setIsModalOpen(false);
  };
  // In ProductsPage.js, replace your handleRemove function with this:
const handleRemove = async (id) => {
  try {
    // Find which category contains the product
    const res = await axios.get("http://localhost:3001/categories");
    const categories = res.data;
    
    let categoryIndex = -1;
    let productIndex = -1;
    
    // Find the product and its category
    categories.forEach((category, catIdx) => {
      category.products.forEach((product, prodIdx) => {
        if (product.id === id) {
          categoryIndex = catIdx;
          productIndex = prodIdx;
        }
      });
    });
    
    if (categoryIndex !== -1 && productIndex !== -1) {
      const category = categories[categoryIndex];
      const product = category.products[productIndex];
      
      // Toggle the isDeleted flag instead of removing the product
      product.isDeleted = true;
      
      // Update the product in the category
      await axios.put(`http://localhost:3001/categories/${category.id}`, category);
      
      // Update the local state to reflect the change
      setProducts(products.map(p => 
        p.id === id ? { ...p, isDeleted: true } : p
      ));
      
      console.log(`Product with ID ${id} soft deleted successfully`);
    } else {
      console.error("Product not found");
    }
  } catch (error) {
    console.error("Error soft deleting product:", error);
  }
};
  

  return (
    <>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed md:relative z-50 md:z-auto w-64 bg-gray-900 text-white md:block ${
            sidebarOpen ? "translate-x-0" : "-translate-x-64"
          } transition-transform duration-300 md:translate-x-0`}
        >
          <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        <div className="flex-1 min-h-screen bg-gray-900 text-white p-6">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold">Products</h1>
            </div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold">Products</h1>
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={() => setIsModalOpen(true)}
              >
                + Add Product
              </button>
            </div>

            {/* Filters */}
            <Filters />

            {/* Product Table */}
            <ProductTable products={products} handleRemove={handleRemove} handleEdit={handleEdit} />


            {/* Modal for Editing Products */}
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
