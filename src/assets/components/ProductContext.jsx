import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import axiosInstance from "./AxiosInstance";
import { normalizeProduct, normalizeImages } from "./Normalize";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("category/All");
      
      const formattedCategories = res.data.map(cat => ({
        ...cat,
        products: cat.products.map(prod => normalizeProduct(prod, cat.name))
      }));
      
      setCategories(formattedCategories);
      setError(null);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Initial data fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  // Handle adding or updating a product
  const addOrUpdateProduct = useCallback(async (formData, isEdit = false, productId = null) => {
    setLoading(true);
    try {
      let response;
      
      if (isEdit && productId) {
        // Update existing product
        response = await axiosInstance.put(`/Product/Update/${productId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Create new product
        response = await axiosInstance.post('/Product/Create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      console.log("Product saved successfully:", response.data);
      
      // Refresh categories data
      await fetchCategories();
      return true;
    } catch (error) {
      console.error("Error saving product:", error);
      
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 
                            error.response.data?.title || 
                            `Server error: ${error.response.status}`;
        setError(errorMessage);
      } else if (error.request) {
        // Request made but no response
        setError("Network error. Please check your connection.");
      } else {
        // Something else happened
        setError("An unexpected error occurred.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  // Handle product deletion
  const deleteProduct = useCallback(async (productId) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/Product/Delete/${productId}`);
      
      console.log("Product deleted successfully");
      
      // Refresh categories data
      await fetchCategories();
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                            error.response.data?.title || 
                            `Server error: ${error.response.status}`;
        setError(errorMessage);
      } else {
        setError("Failed to delete product. Please try again.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);
  
  // Create memoized context value
  const contextValue = useMemo(() => ({
    categories,
    loading,
    error,
    addOrUpdateProduct,
    deleteProduct,
    refreshCategories: fetchCategories,
    clearError: () => setError(null)
  }), [categories, loading, error, addOrUpdateProduct, deleteProduct, fetchCategories]);
  
  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;