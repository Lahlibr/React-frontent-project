import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../components/AxiosInstance";
import { normalizeProduct } from "../../components/Normalize";

const CartPage = () => {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = user?.token
        ? await axiosInstance.get("/Cart/GetCartItems", {
            headers: { Authorization: `Bearer ${user.token}` },
          })
        : { data: { data: { items: JSON.parse(localStorage.getItem("guestCart")) || [] } } };

      const items = response.data?.data?.items || [];
      setCart(items.map((item) => ({ ...normalizeProduct(item), quantity: item.quantity || 1 })));
    } catch (error) {
      console.error("Cart loading error:", error);
      if (cart.length > 0) { // Only show error if we expected items
        toast.error("Failed to load cart");
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const updateCart = useCallback((updatedCart) => {
    if (!user) {
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    }
    setCart(updatedCart);
  }, [user]);

  const removeFromCart = async (productId) => {
    try {
      if (user?.token) {
        await axiosInstance.delete(`/Cart/RemoveFromCart/${productId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }
      
      // Optimistic update - remove item immediately
      const updatedCart = cart.filter((item) => item.id !== productId);
      updateCart(updatedCart);
      
      // Only reload if we're logged in (guest cart is already updated)
      if (user?.token) {
        await loadCart();
      }
      
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Failed to remove item");
      // Revert if error occurs
      loadCart();
    }
  };

  const changeQuantity = async (productId, amount) => {
    try {
      // Optimistic update first
      const updatedCart = cart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      );
      updateCart(updatedCart);

      if (user?.token) {
        const endpoint = amount > 0 ? "AddQuantity" : "ReduceQuantity";
        await axiosInstance.post(
          `/Cart/${endpoint}?productId=${productId}&quantity=${Math.abs(amount)}`,
          null,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        await loadCart();
      }
    } catch (error) {
      console.error("Quantity change error:", error);
      toast.error("Could not update quantity");
      loadCart(); // Revert on error
    }
  };

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + (item.offerPrice || item.price) * item.quantity, 0);

  const handleBuyNow = useCallback(() => {
    if (!cart.length) return toast.info("Your cart is empty");
    if (user) return navigate("/checkout");

    toast.info("Please login to proceed to checkout");
    localStorage.setItem("redirectAfterLogin", "/cart");
    navigate("/login");
  }, [navigate, user, cart]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row p-6">
      <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md mx-4">
        <div className="mb-6 flex items-center">
          <img
            src={user?.avatar || "images/user.jpg"}
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => (e.target.src = "images/user.jpg")}
          />
          <div className="ml-4">
            <h2 className="text-xl font-bold">
              {user ? `${user.username}'s Cart` : "Guest Cart"}
            </h2>
            <p className="text-gray-600">
              {user?.email || (
                <>
                  Please <a href="/login" className="text-blue-500">login</a> to save your cart
                </>
              )}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2">Loading your cart...</p>
          </div>
        ) : cart.length ? (
          <div className="divide-y divide-gray-200">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4">
                <div className="flex items-center">
                  <img
                    src={item.images?.[0]}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/product-placeholder.jpg";
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-gray-600">
                      ₹{item.offerPrice || item.price} × {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex border rounded-md">
                    <button 
                      onClick={() => changeQuantity(item.id, -1)} 
                      className="px-3 py-1 hover:bg-gray-200"
                      disabled={isLoading}
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button 
                      onClick={() => changeQuantity(item.id, 1)} 
                      className="px-3 py-1 hover:bg-gray-200"
                      disabled={isLoading}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md mt-6 md:mt-0 sticky top-6 h-fit">
          <h3 className="text-lg font-bold mb-4">🛒 Order Summary</h3>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Subtotal ({cart.length} items):</span>
              <span>₹{getTotalPrice()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span className="text-green-600">₹{getTotalPrice()}</span>
            </div>
          </div>
          <button
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition mb-4"
            onClick={handleBuyNow}
            disabled={isLoading}
          >
            {user ? "Proceed to Checkout" : "Login to Checkout"}
          </button>
          {!user && (
            <p className="text-sm text-center text-gray-600">
              or <a href="/registration" className="text-blue-500">create an account</a>
            </p>
          )}
        </div>
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default CartPage;