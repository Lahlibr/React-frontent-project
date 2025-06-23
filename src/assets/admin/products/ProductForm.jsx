import { useState, useContext, useEffect, useCallback } from "react";
import { ProductContext } from "../../components/ProductContext";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import RadioGroup from "../components/RadioField";

const initialFormData = {
  title: "",
  description: "",
  category: "",
  price: "",
  offerPrice: "",
  images: null, // Changed to handle file upload
  type: "",
  rating: ""
};

const ProductForm = ({ editProduct, onClose, onSuccess }) => {
  const { addOrUpdateProduct } = useContext(ProductContext);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!editProduct) {
      setFormData(initialFormData);
      setImagePreview(null);
      return;
    }
    
    setFormData({
      title: editProduct.title || "",
      description: editProduct.description || "",
      category: editProduct.category || "",
      price: editProduct.price?.toString() || "",
      offerPrice: editProduct.offerPrice?.toString() || "",
      images: null, // Reset file input for edit
      type: editProduct.type || "",
      rating: editProduct.rating?.toString() || "",
    });
    
    // Set image preview for edit mode
    if (editProduct.images && editProduct.images.length > 0) {
      setImagePreview(Array.isArray(editProduct.images) ? editProduct.images[0] : editProduct.images);
    }
  }, [editProduct]);

  const handleChange = useCallback((e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      
      // Create preview for image
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  const validate = useCallback(() => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Product title is required";
    }
    
    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    
    if (formData.offerPrice && Number(formData.offerPrice) >= Number(formData.price)) {
      newErrors.offerPrice = "Offer price must be less than regular price";
    }
    
    if (formData.rating && (Number(formData.rating) < 0 || Number(formData.rating) > 5)) {
      newErrors.rating = "Rating must be between 0 and 5";
    }
    
    // Only require image for new products
    if (!editProduct && !formData.images) {
      newErrors.images = "Product image is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, editProduct]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);

    // Create FormData for file upload
    const formDataToSend = new FormData();
    
    const productData = {
      productName: formData.title.trim(),
      description: formData.description.trim(),
      realPrice: Number(formData.price),
      offerPrice: formData.offerPrice ? Number(formData.offerPrice) : null,
      type: formData.type,
      rating: formData.rating ? Number(formData.rating) : 0,
      categoryName: formData.category.trim(),
    };

    // Add product data as JSON string
    formDataToSend.append('productDto', JSON.stringify(productData));
    
    // Add image file if present
    if (formData.images) {
      formDataToSend.append('image', formData.images);
    }

    try {
      await addOrUpdateProduct(formDataToSend, !!editProduct, editProduct?.id);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      setErrors({ general: "Failed to save product. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, editProduct, validate, isSubmitting, addOrUpdateProduct, onSuccess, onClose]);

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">
        {editProduct ? "Edit Product" : "Add New Product"}
      </h2>
      
      {errors.general && (
        <div className="bg-red-600 text-white p-3 rounded mb-4">
          {errors.general}
        </div>
      )}

      <InputField
        label="Product Title"
        name="title"
        type="text"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required={true}
      />

      <InputField
        label="Description"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={handleChange}
      />

      <SelectField
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        error={errors.category}
        required={true}
      />

      <InputField
        label="Price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        error={errors.price}
        required={true}
        min="0"
        step="0.01"
      />

      <InputField
        label="Offer Price"
        name="offerPrice"
        type="number"
        value={formData.offerPrice}
        onChange={handleChange}
        error={errors.offerPrice}
        min="0"
        step="0.01"
      />

      <RadioGroup
        label="Product Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        options={["Veg", "Non-Veg"]}
      />

      <InputField
        label="Rating"
        name="rating"
        type="number"
        value={formData.rating}
        onChange={handleChange}
        error={errors.rating}
        min="0"
        max="5"
        step="0.1"
      />

      {/* File Upload Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-2">
          Product Image {!editProduct && <span className="text-red-500">*</span>}
        </label>
        <input
          type="file"
          name="images"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {errors.images && (
          <p className="text-red-500 text-sm mt-1">{errors.images}</p>
        )}
        
        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border border-gray-600"
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-3 mt-6">
        <button 
          type="button"
          onClick={onClose}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded text-white font-medium transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded text-white font-medium transition-colors"
        >
          {isSubmitting ? "Saving..." : (editProduct ? "Update Product" : "Add Product")}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;