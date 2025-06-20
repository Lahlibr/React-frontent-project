import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { UserContext } from "../../components/UserProvider";
import NavItems from "../../components/NavItems";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../components/AxiosInstance";
import { normalizeProduct } from "../../components/Normalize";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);
  const { wishlist, cart, updateWishlist, updateCart } = useContext(UserContext);
  const location = useLocation();
  const category = new URLSearchParams(location.search).get("category");
  const navigate = useNavigate();

  // Fetch products by category
  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(`/Product/pdbyct/${category}`);
        const normalizedProducts = Array.isArray(response.data)
          ? response.data.map(product => normalizeProduct(product, category)).filter(Boolean)
          : [];
        setProducts(normalizedProducts);
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error("Error fetching products:", error);
          toast.error("Failed to load products");
        }
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [category]);

  const handleBuyNow = useCallback((product, e) => {
    e.stopPropagation();
    updateCart(product);
    navigate("/checkout");
  }, [navigate, updateCart]);

  const handleAddToCart = useCallback(async (product, e) => {
    e.stopPropagation();
    if (isUpdatingCart) return;
    
    setIsUpdatingCart(true);

    const cartItem = {
      id: product.id,
      productId: product.id, // Consistent ID naming
      name: product.title,
      price: product.price,
      offerPrice: product.offerPrice,
      img: product.images?.[0],
      type: product.type,
      inStock: product.inStock,
      rating: product.rating,
      description: product.description,
      category: product.category,
      quantity: 1
    };

    try {
      // Check in cart using both id and productId for backward compatibility
      const isProductInCart = cart.some(item => 
        item.productId === product.id || item.id === product.id
      );

      if (isProductInCart) {
        toast.info("Item already in cart! Redirecting to cart page.");
        navigate("/cart");
      } else {
        const success = await updateCart(cartItem);
        if (success) {
          toast.success("Added to cart");
        }
      }
    } catch (error) {
      toast.error("Failed to add to cart",error);
    } finally {
      setIsUpdatingCart(false);
    }
  }, [isUpdatingCart, cart, navigate, updateCart]);

  const renderedProductCards = useMemo(() => (
    (products || []).map(product => {
      const discount = Math.round(
        ((product.price - product.offerPrice) / product.price) * 100
      ) || 0;

      return (
        <div
          key={product.id}
          className="bg-white p-6 rounded-lg hover:shadow-2xl transition hover:scale-105 relative cursor-pointer"
          onClick={() => setSelectedProduct(product)}
        >
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
              {discount}% OFF
            </span>
          )}

          <button
            className="absolute top-2 right-2 text-2xl z-20"
            onClick={(e) => {
              e.stopPropagation();
              updateWishlist(product);
            }}
          >
            <FaHeart className={wishlist.some(item => item.id === product.id) ? "text-red-500" : "text-gray-400"} />
          </button>

          <img src={product.images?.[0]} alt={product.title} className="w-full h-40 object-cover rounded-lg" />
          <h3 className="text-lg font-bold mt-4 text-black">{product.title}</h3>
          <p className="text-sm text-gray-600">
            {product.description ? product.description.slice(0, 50) + "..." : "No description"}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-green-600">₹{product.offerPrice}</p>
              <p className="text-sm text-gray-500 line-through">₹{product.price}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              product.type === "Veg" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {product.type === "Veg" ? "🥦 Veg" : "🍗 Non-Veg"}
            </span>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              className="bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProduct(product);
              }}
            >
              View Details
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full"
              onClick={(e) => handleBuyNow(product, e)}
            >
              Buy Now
            </button>
          </div>
        </div>
      );
    })
  ), [products, wishlist, handleBuyNow, updateWishlist]);

  return (
    <>
      <NavItems />
      <section className="w-full pt-20 min-h-screen py-12 px-6 bg-black text-white">
        <h2 className="text-3xl font-bold text-center mb-8">{category || "All Products"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {renderedProductCards}
        </div>
      </section>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-2xl w-full max-w-4xl mx-4 shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 text-2xl font-bold text-gray-700 hover:text-red-500 transition"
            >
              ✖
            </button>

            <div className="md:w-1/2 w-full p-4 flex items-center justify-center bg-gray-100">
              <img
                src={selectedProduct.images?.[0]}
                alt={selectedProduct.title}
                className="max-h-[350px] w-full object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="md:w-1/2 w-full p-6 flex flex-col justify-center gap-3">
              <h2 className="text-2xl font-bold">{selectedProduct.title}</h2>
              <p className="text-gray-600 text-sm">{selectedProduct.description}</p>
            
              <div className="flex items-center gap-3 mt-2">
                <p className="text-2xl font-bold text-green-600">₹{selectedProduct.offerPrice}</p>
                <p className="line-through text-red-500 text-base">₹{selectedProduct.price}</p>
              </div>

              <p className="text-sm text-gray-700">
                Type:{" "}
                <span className={`font-semibold ${
                  selectedProduct.type === "Veg" ? "text-green-600" : "text-red-600"
                }`}>
                  {selectedProduct.type}
                </span>
              </p>

              <p className="text-sm text-yellow-500 font-medium">⭐ {selectedProduct.rating} / 5</p>

              <p className={`text-sm font-semibold ${
                selectedProduct.inStock > 0 ? "text-green-600" : "text-red-600"
              }`}>
                {selectedProduct.inStock > 0 ? "In Stock" : "Out of Stock"}
              </p>

              <div className="mt-6 flex gap-4">
                <button
                  className={`w-1/2 px-4 py-2 rounded-xl text-sm font-medium transition duration-200 shadow ${
                    cart.some(item => 
                      item.productId === selectedProduct.id || item.id === selectedProduct.id
                    )
                      ? "bg-gray-500 text-white hover:bg-gray-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  onClick={(e) => handleAddToCart(selectedProduct, e)}
                  disabled={isUpdatingCart}
                >
                  {isUpdatingCart ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4"/>
                      </svg>
                      Processing...
                    </span>
                  ) : cart.some(item => 
                      item.productId === selectedProduct.id || item.id === selectedProduct.id
                    ) ? (
                    "Go to Cart"
                  ) : (
                    "🛒 Add to Cart"
                  )}
                </button>

                <button
                  className="w-1/2 px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition duration-200 shadow"
                  onClick={(e) => handleBuyNow(selectedProduct, e)}
                >
                  ⚡ Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ProductCard;