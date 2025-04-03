import { useState, useContext, useEffect } from "react";
import { ProductContext } from "../../components/ProductContext";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import RadioGroup from "../components/RadioField";

const ProductForm = ({ editProduct, onClose }) => {
  const { categories, addOrUpdateProduct } = useContext(ProductContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    offerPrice: "",
    images: "",
    type: "",
    rating: ""
  });

  useEffect(() => {
    if (editProduct) {
      console.log("Edit Product Data:", editProduct);
  
      // Fix images handling for edit mode
      const imagesString = Array.isArray(editProduct.images) 
        ? editProduct.images.join(", ") 
        : typeof editProduct.images === 'string' 
          ? editProduct.images 
          : "";
      
      setFormData({
        title: editProduct.title || "",
        description: editProduct.description || "",
        category: editProduct.category || "",
        price: editProduct.price || "",
        offerPrice: editProduct.offerPrice || "",
        images: imagesString,
        type: editProduct.type || "",
        rating: editProduct.rating || "",
      });
    }
  }, [editProduct]);
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Product title is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Valid price is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Properly format images array
      let formattedImages;
      if (typeof formData.images === 'string') {
        formattedImages = formData.images.split(",").map(img => img.trim()).filter(img => img !== "");
      } else if (Array.isArray(formData.images)) {
        formattedImages = formData.images;
      } else {
        formattedImages = [];
      }

      // Include the id from editProduct if in edit mode
      const productData = {
        id: editProduct ? editProduct.id : undefined,
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        offerPrice: formData.offerPrice ? Number(formData.offerPrice) : null,
        images: formattedImages,
        type: formData.type,
        rating: formData.rating ? Number(formData.rating) : null,
        category: formData.category.trim(),
      };

      console.log("Submitting product data:", productData);
      
      const success = await addOrUpdateProduct(productData, !!editProduct);

      if (success) {
        onClose();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-800 rounded-lg">
      <InputField 
        label="Product Title" 
        type="text" 
        name="title" 
        value={formData.title} 
        onChange={handleChange} 
        error={errors.title} 
      />
      <InputField 
        label="Description" 
        type="text" 
        name="description" 
        value={formData.description} 
        onChange={handleChange} 
      />
      <SelectField 
        label="Category" 
        name="category" 
        value={formData.category} 
        onChange={handleChange} 
        error={errors.category} 
      />
      <InputField 
        label="Price" 
        type="number" 
        name="price" 
        value={formData.price} 
        onChange={handleChange} 
        error={errors.price} 
      />
      <InputField 
        label="Offer Price" 
        type="number" 
        name="offerPrice" 
        value={formData.offerPrice} 
        onChange={handleChange} 
      />
      <RadioGroup 
        label="Product Type" 
        name="type" 
        options={["Veg", "Non-Veg"]} 
        value={formData.type} 
        onChange={handleChange} 
      />
      <InputField 
        label="Rating" 
        type="number" 
        name="rating" 
        value={formData.rating} 
        onChange={handleChange} 
      />
      <InputField 
        label="Image URLs (comma-separated)" 
        type="text" 
        name="images" 
        value={formData.images} 
        onChange={handleChange} 
      />
      
      <button 
        type="submit" 
        className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold"
      >
        {editProduct ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;