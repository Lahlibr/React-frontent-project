import React, { createContext, useState, useMemo } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const updateWishlist = async (product, e) => {
    if (e) e.preventDefault();
    if (!user) return toast.warn("Please log in to update your wishlist!");

    const isInWishlist = user.wishlist?.some(item => item.id === product.id);
    const updatedWishlist = isInWishlist
      ? user.wishlist.filter(item => item.id !== product.id)
      : [...(user.wishlist || []), product];

    updateUserState({ ...user, wishlist: updatedWishlist });

    try {
      await axios.patch(`http://localhost:3001/users/${user.id}`, { wishlist: updatedWishlist });
      toast.success(isInWishlist ? "Removed from Wishlist" : "Added to Wishlist");
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const updateCart = async (product, e) => {
    if (e) e.preventDefault();
    if (!user) return toast.warn("Please log in to add items to cart!");

    const updatedCart = user.cart?.some(item => item.id === product.id)
      ? user.cart.map(item =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        )
      : [...(user.cart || []), { ...product, quantity: 1 }];

    updateUserState({ ...user, cart: updatedCart });

    try {
      await axios.patch(`http://localhost:3001/users/${user.id}`, { cart: updatedCart });
      toast.success(user.cart?.some(item => item.id === product.id) ? "Quantity Updated" : "Added to Cart");
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    }
  };

  const contextValue = useMemo(() => ({
    user,
    wishlist: user?.wishlist || [],
    cart: user?.cart || [],
    updateWishlist,
    updateCart,
  }), [user]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </UserContext.Provider>
  );
};

export default UserProvider;
