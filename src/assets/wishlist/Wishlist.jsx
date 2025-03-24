import React, { useState, useEffect, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, Trash, Menu } from "lucide-react";
import { categories } from "../categories/Categories";
import { Link } from "react-router-dom";

const WishlistPage = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [wishlist, setWishlist] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (!storedUser) {
      alert("Please log in to view your wishlist.");
      navigate("/login");
    } else {
      const storedWishlist = JSON.parse(localStorage.getItem(`wishlist_${storedUser.email}`)) || [];
      setWishlist(storedWishlist);
    }
  }, []); // ✅ Runs only once when component mounts

  useEffect(() => {
    if (user) {
      const storedWishlist = JSON.parse(localStorage.getItem(`wishlist_${user.email}`)) || [];
      setWishlist(storedWishlist);
    }
  }, [location]); // ✅ Updates wishlist when URL changes

  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) => {
      const updatedWishlist = prevWishlist.filter((item) => item.id !== productId);
      localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(updatedWishlist));
      return updatedWishlist;
    });
  };

  const moveToCart = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    const userCartKey = `cart_${user.email}`;
    const currentCart = JSON.parse(localStorage.getItem(userCartKey)) || [];
    localStorage.setItem(userCartKey, JSON.stringify([...currentCart, product]));
    removeFromWishlist(product.id);
    alert("Item moved to cart!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 flex flex-col md:flex-row relative">
      <button
        className="md:hidden bg-blue-500 text-white p-2 rounded-lg flex items-center gap-2 mb-4"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        <Menu size={20} /> Categories
      </button>

      {/* Left Sidebar (Categories) */}
      <aside
        className={`absolute md:relative left-0 top-16 md:top-0 bg-white p-4 shadow-lg rounded-lg md:w-1/5 transition-transform transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories</h2>
        <ul className="text-gray-600 space-y-2">
          {categories.map((category, index) => (
            <li key={index} className="hover:text-blue-500 cursor-pointer">
              <Link
                to={`/product?category=${encodeURIComponent(category.name)}`}
                className="text-blue-600 hover:underline"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">💖 Your Wishlist</h1>
        {wishlist.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                <img src={item.img} alt={item.name} className="w-40 h-40 object-cover rounded-lg" />
                <h3 className="text-lg font-semibold mt-3 text-center">{item.name}</h3>
                <p className="text-gray-600 text-sm">₹{item.new_price}</p>
                <div className="flex mt-4 gap-4">
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
                  >
                    <Trash size={16} /> Remove
                  </button>
                  <button
                    onClick={() => moveToCart(item)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                  >
                    <Heart size={16} /> Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-lg text-center">Your wishlist is empty. Start adding your favorite items! 💕</p>
        )}
      </main>
    </div>
  );
});

export default WishlistPage;
