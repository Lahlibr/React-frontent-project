import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import NavItems from "../components/NavItems";
import Footer from "../components/Footer";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const category = new URLSearchParams(useLocation().search).get("category");
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = Boolean(user);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/db.json")
      .then(({ data }) => {
        setProducts(
          category
            ? data.categories.find((cat) => cat.name === category)?.products || []
            : data.products || []
        );
      })
      .catch(console.error);
  }, [category]);

  const toggleWishlist = (product) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    const userWishlistKey = `wishlist_${user.email}`;
    const storedWishlist = JSON.parse(localStorage.getItem(userWishlistKey)) || [];
  
    const isAlreadyInWishlist = storedWishlist.some((item) => item.id === product.id);
  
    let updatedWishlist;
    if (isAlreadyInWishlist) {
      updatedWishlist = storedWishlist.filter((item) => item.id !== product.id);
    } else {
      updatedWishlist = [...storedWishlist, product];
    }
  
    localStorage.setItem(userWishlistKey, JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
  };

  const addToCart = (product) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    const userCartKey = `cart_${user.email}`;
    const currentCart = JSON.parse(localStorage.getItem(userCartKey)) || [];
    const updatedCart = [...currentCart, product];

    localStorage.setItem(userCartKey, JSON.stringify(updatedCart));
    alert("Item added to cart!");
  };
  const addToCartAndCheckout = (product) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    const userCartKey = `cart_${user.email}`;
    const currentCart = JSON.parse(localStorage.getItem(userCartKey)) || [];
  
    // Add only the selected product (not duplicate full cart)
    const updatedCart = [...currentCart, product];
    localStorage.setItem(userCartKey, JSON.stringify(updatedCart));
  
    navigate("/checkout"); // Redirect to checkout after adding
  };
  

  return (
    <>
      <NavItems />
      <section className="w-full pt-20 min-h-screen py-12 px-6 bg-black text-white">
        <h2 className="text-3xl font-bold text-center mb-8">
          {category || "All Products"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length ? (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-6 rounded-lg hover:shadow-2xl transition hover:scale-105 relative"
              >
                <button
                  className="absolute top-2 right-2 text-2xl"
                  onClick={() => toggleWishlist(product)}
                >
                  <FaHeart className={wishlist.some((item) => item.id === product.id) ? "text-red-500" : "text-gray-400"} />

                </button>
                {product.offer && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.offer} OFF
                  </span>
                )}
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="text-lg font-bold mt-4 text-black">{product.name}</h3>
                <p className="text-gray-400 text-sm">{product.description.slice(0, 50)}...</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-lg font-bold">
                    <span className="text-gray-400 line-through text-sm mr-2">
                      ₹{product.old_price}
                    </span>
                    <span className="text-green-400">₹{product.new_price}</span>
                  </p>
                  <p className={product.type === "Veg" ? "text-green-300" : "text-red-400"}>
                    {product.type === "Veg" ? "🟢" : "🔴"} {product.type}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    className="bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
                    onClick={() => setSelectedProduct(product)}
                  >
                    View Details
                  </button>
                  
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full" onClick={() => addToCartAndCheckout(product)}>
                    Buy Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-full">No products found.</p>
          )}
        </div>

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-md p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative flex">
              <button
                className="absolute top-2 right-2 text-gray-600 text-2xl hover:text-red-600"
                onClick={() => setSelectedProduct(null)}
              >
                ×
              </button>
              <img
                src={selectedProduct.img}
                alt={selectedProduct.name}
                className="w-1/2 h-auto object-cover rounded-lg"
              />
              <div className="w-1/2 pl-6 space-y-4">
                {selectedProduct.offer && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {selectedProduct.offer} OFF
                  </span>
                )}
                <h3 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h3>
                <p className="text-gray-600">{selectedProduct.description}</p>
                <div className="flex items-center space-x-4">
                  <p className="text-lg font-bold">
                    <span className="text-gray-500 line-through text-sm mr-2">
                      ₹{selectedProduct.old_price}
                    </span>
                    <span className="text-green-500">₹{selectedProduct.new_price}</span>
                  </p>
                  <p className={selectedProduct.type === "Veg" ? "text-green-500" : "text-red-500"}>
                    {selectedProduct.type === "Veg" ? "🟢" : "🔴"} {selectedProduct.type}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    onClick={() => addToCart(selectedProduct)}
                  >
                    Add to Cart
                  </button>
                  <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700" >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
};

export default ProductCard;