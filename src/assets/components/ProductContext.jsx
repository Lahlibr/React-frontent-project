import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from 'uuid';
import axiosInstance from "./AxiosInstance";
import { normalizeProduct,normalizeImages } from "./Normalize";

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
  const addOrUpdateProduct = useCallback(async (product, isEdit = false) => {
    setLoading(true);
    try {
      // Get fresh categories data
      const res = await axiosInstance.get(`category/All`);
      const categoriesData = res.data;
      
      // Find the target category
      const categoryIndex = categoriesData.findIndex(
        cat => cat.name.trim().toLowerCase() === product.category.trim().toLowerCase()
      );
      
      if (categoryIndex === -1) {
        throw new Error(`Category "${product.category}" not found`);
      }
      
      const targetCategory = categoriesData[categoryIndex];
      const updatedProducts = [...targetCategory.products];
      
      // Format product for API
      const formattedProduct = {
        id: product.id || uuidv4(),
        name: product.title,
        description: product.description,
        new_price: Number(product.price),
        old_price: Number(product.offerPrice) || null,
        img: normalizeImages(product.images),
        type: product.type || "",
        rating: Number(product.rating) || 0,
        isDeleted: product.isDeleted || false // Add this line
      };
      
      if (isEdit) {
        // Update existing product
        const productIndex = updatedProducts.findIndex(p => p.id === product.id);
        
        if (productIndex === -1) {
          throw new Error(`Product with ID ${product.id} not found`);
        }
        
        updatedProducts[productIndex] = formattedProduct;
      } else {
        // Add new product
        updatedProducts.push(formattedProduct);
      }
      
      // Update the category
      await axiosInstance.put(`category/${targetCategory.id}`, {
        ...targetCategory,
        products: updatedProducts
      });
      
      // Refresh data
      await fetchCategories();
      return true;
    } catch (error) {
      console.error("Error saving product:", error);
      setError(error.message);
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
    refreshCategories: fetchCategories
  }), [categories, loading, error, addOrUpdateProduct, fetchCategories]);
  
  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;