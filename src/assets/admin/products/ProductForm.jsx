import { useState, useContext, useEffect } from "react";
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
  images: "",
  type: "",
  rating: ""
};

const ProductForm = ({ editProduct, onClose, refreshProducts }) => {
  const { addOrUpdateProduct } = useContext(ProductContext);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!editProduct) return;
    
    const imagesString = Array.isArray(editProduct.images) 
      ? editProduct.images.join(", ") 
      : editProduct.images || "";
    
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
  }, [editProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Product title is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Valid price is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formattedImages = typeof formData.images === 'string' 
      ? formData.images.split(",").map(img => img.trim()).filter(Boolean)
      : formData.images || [];

    const productData = {
      id: editProduct?.id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      offerPrice: formData.offerPrice ? Number(formData.offerPrice) : null,
      images: formattedImages,
      type: formData.type,
      rating: formData.rating ? Number(formData.rating) : null,
      category: formData.category.trim(),
    };

    try {
      await addOrUpdateProduct(productData, !!editProduct);
      onClose();
      refreshProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const formFields = [
    { component: InputField, label: "Product Title", name: "title", type: "text", error: errors.title },
    { component: InputField, label: "Description", name: "description", type: "text" },
    { component: SelectField, label: "Category", name: "category", error: errors.category },
    { component: InputField, label: "Price", name: "price", type: "number", error: errors.price },
    { component: InputField, label: "Offer Price", name: "offerPrice", type: "number" },
    { component: RadioGroup, label: "Product Type", name: "type", options: ["Veg", "Non-Veg"] },
    { component: InputField, label: "Rating", name: "rating", type: "number" },
    { component: InputField, label: "Image URLs (comma-separated)", name: "images", type: "text" },
  ];

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-800 rounded-lg">
      {formFields.map((field, index) => {
        const FieldComponent = field.component;
        return (
          <FieldComponent
            key={index}
            label={field.label}
            name={field.name}
            type={field.type}
            value={formData[field.name]}
            onChange={handleChange}
            error={field.error}
            options={field.options}
          />
        );
      })}
      
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