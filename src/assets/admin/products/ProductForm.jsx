import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/AxiosInstance";

const ProductForm = ({ onClose, editProduct }) => {
  const [formData, setFormData] = useState({
    id: "",
    productName: "",
    category: "",
    price: "",
    offerPrice: "",
    type: "",
    rating: "",
    description: "",
    images: [],
  });

  useEffect(() => {
  if (editProduct) {
    setFormData({
      id: editProduct.id || "",
      productName: editProduct.productName || "",
      category: editProduct.category?.name || "", // assuming category is an object
      price: editProduct.realPrice?.toString() || "", // map realPrice to price
      offerPrice: editProduct.offerPrice?.toString() || "",
      type: editProduct.type || "",
      rating: editProduct.rating?.toString() || "",
      description: editProduct.description || "",
      images: Array.isArray(editProduct.images)
        ? editProduct.images
        : typeof editProduct.images === "string"
        ? editProduct.images.split(",").map((url) => url.trim())
        : [],
    });
  }
}, [editProduct]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Use consistent endpoint - match with ProductsPage
      const response = await axiosInstance.get("category/All");
      const categories = response.data;

      if (editProduct) {
        // === Edit Product Flow ===
        let categoryToUpdate = null;
        let productIndex = -1;

        for (const category of categories) {
          productIndex = category.products.findIndex(
            (p) => p.id === formData.id
          );
          if (productIndex !== -1) {
            categoryToUpdate = category;
            break;
          }
        }

        if (categoryToUpdate && productIndex !== -1) {
          const updatedCategory = {
            ...categoryToUpdate,
            products: categoryToUpdate.products.map((product, index) =>
              index === productIndex
                ? {
                    ...product,
                    productName: formData.productName,
                    realPrice: parseFloat(formData.price), // Keep realPrice for API
                    offerPrice: parseFloat(formData.offerPrice),
                    type: formData.type,
                    rating: parseFloat(formData.rating),
                    description: formData.description,
                    images: formData.images, // Keep images for API
                  }
                : product
            ),
          };

          // Use consistent endpoint - match with ProductsPage handleRemove
          await axiosInstance.put(
            `Category/Update/${categoryToUpdate.id}`, // Fixed: was Product/Update
            updatedCategory,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          
          console.log("Product updated successfully");
        }
      } else {
        // === Add Product Flow ===
        const targetCategory = categories.find(
          (c) => c.name.toLowerCase() === formData.category.toLowerCase()
        );

        const newProduct = {
          id: Date.now(),
          productName: formData.productName,
          realPrice: parseFloat(formData.price),
          offerPrice: parseFloat(formData.offerPrice),
          type: formData.type,
          rating: parseFloat(formData.rating),
          description: formData.description,
          images: formData.images,
          isDeleted: false, // Add isDeleted field
        };

        if (targetCategory) {
          const updatedCategory = {
            ...targetCategory,
            products: [...targetCategory.products, newProduct],
          };

          await axiosInstance.put(
            `Category/Update/${targetCategory.id}`,
            updatedCategory,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          // If category not found, create a new one
          const newCategory = {
            name: formData.category,
            id: Date.now(),
            products: [newProduct],
          };

          await axiosInstance.post("Category/Create", newCategory, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      }

      console.log("Operation completed successfully");
      onClose(); // This will trigger fetchProducts() in ProductsPage
    } catch (error) {
      console.error("Failed to submit product", error);
      // Add user feedback for errors
      alert("Failed to save product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        {editProduct ? "Edit Product" : "Add New Product"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer Price
            </label>
            <input
              type="number"
              name="offerPrice"
              value={formData.offerPrice}
              onChange={handleChange}
              placeholder="Offer Price"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Type"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Fixed Image URL field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URLs
            </label>
            <input
              type="text"
              name="images"
              placeholder="Image URL (comma-separated)"
              value={Array.isArray(formData.images) ? formData.images.join(",") : ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  images: e.target.value
                    .split(",")
                    .map((url) => url.trim())
                    .filter((url) => url),
                }))
              }
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="Rating"
              min="0"
              max="5"
              step="0.1"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting
              ? "Submitting..."
              : editProduct
              ? "Update Product"
              : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;