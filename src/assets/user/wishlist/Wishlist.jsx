import React, { useState, useEffect, memo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Heart, Trash, Menu } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../components/AxiosInstance";

const WishlistPage = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [wishlist, setWishlist] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const categories = [
    { name: "Electronics" },
    { name: "Clothing" },
    { name: "Books" },
    { name: "Shoes" },
    { name: "Accessories" },
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (storedUser) {
      fetchWishlistFromServer(storedUser.email);
    } else {
      // Guest user - load wishlist from localStorage
      const guestWishlist = JSON.parse(localStorage.getItem("guest_wishlist")) || [];
      setWishlist(guestWishlist);
    }
  }, [location]);

  const fetchWishlistFromServer = async (email) => {
    try {
      const response = await axiosInstance.get(`http://localhost:3001/users?email=${email}`);
      const userData = response.data[0];
      if (userData?.wishlist) {
        setWishlist(userData.wishlist);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const updateWishlistToServer = async (updatedWishlist) => {
    try {
      const { data } = await axios.get(`http://localhost:3001/users?email=${user.email}`);
      const userData = data[0];
      if (userData) {
        await axios.patch(`http://localhost:3001/users/${userData.id}`, {
          wishlist: updatedWishlist,
        });
        setWishlist(updatedWishlist);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== productId);

    if (user) {
      updateWishlistToServer(updatedWishlist);
    } else {
      localStorage.setItem("guest_wishlist", JSON.stringify(updatedWishlist));
      setWishlist(updatedWishlist);
    }

    toast.success("Item removed from wishlist!");
  };

  const moveToCart = async (product) => {
    if (!user) {
      toast.error("Login required to move items to cart.");
      return;
    }

    try {
      const { data } = await axios.get(`http://localhost:3001/users?email=${user.email}`);
      const userData = data[0];

      if (userData) {
        const updatedCart = [...(userData.cart || []), product];
        await axios.patch(`http://localhost:3001/users/${userData.id}`, { cart: updatedCart });

        removeFromWishlist(product.id);
        toast.success("Item moved to cart!");
      }
    } catch (error) {
      console.error("Error moving item to cart:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 flex flex-col md:flex-row relative">
      <button
        className="md:hidden bg-blue-500 text-white p-2 rounded-lg flex items-center gap-2 mb-4"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        <Menu size={20} /> Categories
      </button>

      {/* Sidebar */}
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
          <p className="text-gray-500 text-lg text-center">
            Your wishlist is empty. Start adding your favorite items! 💕
          </p>
        )}
      </main>

      <ToastContainer />
    </div>
  );
});

export default WishlistPage;
