// utils/normalize.js

export const normalizeImages = (item) => {
  const fallbackPlaceholder = "https://res.cloudinary.com/dr9fxdf4m/image/upload/v1749827947/q6vosr4xwwy3exx4rdcy.jpg";

  let images = [];

  if (Array.isArray(item.images)) {
    images = item.images.filter(Boolean);
  } else if (typeof item.image === "string" && item.image.trim()) {
    images = [item.image]; // <-- Add this line
  } else if (typeof item.imageUrl === "string" && item.imageUrl.trim()) {
    images = [item.imageUrl];
  } else if (typeof item.img === "string" && item.img.trim()) {
    images = [item.img];
  }

  const finalImages = images.filter((url) => typeof url === "string" && url.startsWith("http"));

  return {
    ...item,
    images: finalImages.length > 0 ? finalImages : [fallbackPlaceholder],
  };
};





export const normalizeProduct = (product, categoryName) => {
  const normalizedproductimage = normalizeImages(product); // pass the full product object

  return {
    id: product.id || product.productId,
    title: product.title || product.name || product.productName || "",
    price: Number(product.price || product.realPrice || 0),
    offerPrice: Number(product.offerPrice || product.old_price || 0),
    discount: (product.price - product.offerPrice) / product.price * 100 || 0,
    quantity: product.quantity || 1,
    images: normalizedproductimage.images, // safely use normalized images
    description: product.description || "",
    type: product.type || "",
    rating: Number(product.rating || 0),
    category: categoryName,
    isDeleted: product.isDeleted || false,
    inStock: product.inStock !== undefined ? Boolean(product.inStock) : true, // Ensure inStock is a boolean
  };
};


export const normalizeCategory = (category) => {
  const {images} = normalizeImages(category);

  return {
    id: category.id || category.categoryId,
    name: category.name || "",
    description: category.description || "",
    image: images[0] || "", // ✅ direct string
    products: Array.isArray(category.products)
      ? category.products.map(prod => normalizeProduct(prod, category.name))
      : [],
  };
};
export const normalizeAddress = (address) => {
  return {
    id: address.id || address.addressId,
    houseName: address.houseName || "",
    street: address.street || address.addressLine1 || "",
    city: address.city || "",
    state: address.state || "",
    pincode: address.pincode || address.zipCode || "",
    landmark: address.landmark || "",
    phoneNumber: address.phoneNumber || address.phone || "",
    isDefault: Boolean(address.isDefault)
  };
};

// Add to your existing exports
export default {
  normalizeImages,
  normalizeProduct,
  normalizeCategory,
  normalizeAddress
};