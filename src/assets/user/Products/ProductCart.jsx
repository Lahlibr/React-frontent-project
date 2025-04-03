import React, { useState, useEffect, useContext, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { UserContext } from "../../components/UserProvider";
import NavItems from "../../components/NavItems";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user, wishlist, cart, updateWishlist, updateCart } = useContext(UserContext);
  const location = useLocation();
  const category = new URLSearchParams(location.search).get("category");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/db.json")
      .then(({ data }) => 
        setProducts(data.categories.flatMap(c => 
          c.products.map(p => ({ ...p, category: c.name }))
        ))
      )
      .catch(console.error);
  }, []);

  const filteredProducts = category ? products.filter(p => p.category === category) : products;

  const handleBuyNow = useCallback((product, e) => {
    e.stopPropagation();
    updateCart(product);
    navigate("/checkout");
  }, [navigate, updateCart]);
  
  const handleAddToCart = useCallback((product, e) => {
    e.stopPropagation();
    
    // Create a consistent cart item structure
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.new_price || product.price,
      img: product.img,
      quantity: 1
    };
  
    const isProductInCart = cart.some(item => item.id === product.id);
    
    if (isProductInCart) {
      toast.info("Item already in cart! Redirecting to cart page.");
      navigate("/cart");
    } else {
      updateCart(cartItem);
      toast.success(`${product.name} added to cart!`);
    }
  }, [cart, navigate, updateCart]);

  return (
    <>
      <NavItems />
      <section className="w-full pt-20 min-h-screen py-12 px-6 bg-black text-white">
        <h2 className="text-3xl font-bold text-center mb-8">{category || "All Products"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="bg-white p-6 rounded-lg hover:shadow-2xl transition hover:scale-105 relative cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <button 
                className="absolute top-2 right-2 text-2xl z-10" 
                onClick={(e) => {
                  e.stopPropagation();
                  updateWishlist(product, e);
                }}
              >
                <FaHeart className={wishlist.some(item => item.id === product.id) ? "text-red-500" : "text-gray-400"} />
              </button>
              <img src={product.img} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
              <h3 className="text-lg font-bold mt-4 text-black">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.description.slice(0, 50)}...</p>
              <p className="text-lg font-semibold text-black mt-2">₹{product.new_price}</p>
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
          ))}
        </div>
      </section>

      {selectedProduct && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full h-[400px] flex relative shadow-lg border border-gray-200">
            <button 
              className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-red-500" 
              onClick={() => setSelectedProduct(null)}
            >
              ✖
            </button>
            <div className="w-2/5 flex items-center justify-center">
              <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-[360px] object-cover rounded-lg shadow-md" />
            </div>
            <div className="w-3/5 pl-6 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h3>
              <p className="text-gray-600 text-sm mt-2">{selectedProduct.description}</p>
              <p className="text-lg font-semibold mt-2 text-gray-800">
                ₹{selectedProduct.new_price} <span className="line-through text-red-500 ml-2 text-sm">₹{selectedProduct.old_price}</span>
              </p>
              <p className="text-sm text-green-600 font-medium">{selectedProduct.offer}</p>
              <p className="text-sm text-gray-500 mt-1">Type: {selectedProduct.type}</p>
              <p className="text-sm text-yellow-500 font-semibold mt-1">⭐ {selectedProduct.rating} / 5</p>
              <div className="mt-6 flex gap-4">
                <button 
                  className={`px-4 py-2 rounded-lg w-1/2 text-sm transition ${cart.some(item => item.id === selectedProduct.id) ? "bg-gray-500 text-white hover:bg-gray-700" : "bg-blue-500 text-white hover:bg-blue-700"}`}
                  onClick={(e) => handleAddToCart(selectedProduct, e)}
                >
                  {cart.some(item => item.id === selectedProduct.id) ? "Go to Cart" : "🛒 Add to Cart"}
                </button>
                <button 
                  className="bg-green-500 text-white px-4 py-2 rounded-lg w-1/2 text-sm hover:bg-green-700 transition" 
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