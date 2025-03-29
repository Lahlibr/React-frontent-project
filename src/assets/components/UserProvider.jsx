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
    e.preventDefault();
    
    if (e) e.preventDefault();
    if (!user) return toast.warn("Please log in to update your wishlist!");

    const updatedWishlist = user.wishlist?.some(item => item.id === product.id)
      ? user.wishlist.filter(item => item.id !== product.id)
      : [...(user.wishlist || []), product];

    updateUserState({ ...user, wishlist: updatedWishlist });

    await axios.patch(`http://localhost:3001/users/${user.id}`, { wishlist: updatedWishlist });
    toast.success(updatedWishlist.some(item => item.id === product.id) ? "Added to Wishlist" : "Removed from Wishlist");
  };

  const updateCart = async (product) => {
    if (!user) {
      toast.warn("Please log in to add items to the cart.");
      return;
    }
  
    try {
      // Fetch the latest user data to get the actual cart state
      const userResponse = await axios.get(`http://localhost:3001/users/${user.id}`);
      const latestUserData = userResponse.data;
      const latestCart = latestUserData.cart || [];
  
      const isProductInCart = latestCart.some(item => item.id === product.id);
      
      let updatedCart;
      if (isProductInCart) {
        updatedCart = latestCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...latestCart, { ...product, quantity: 1 }];
      }
  
      // Update cart in the database
      await axios.patch(`http://localhost:3001/users/${user.id}`, { cart: updatedCart });
  
      // Fetch updated user data again
      const updatedResponse = await axios.get(`http://localhost:3001/users/${user.id}`);
      const updatedUserData = updatedResponse.data;
  
      // Update local state
      updateUserState(updatedUserData);
  
      toast.success(isProductInCart ? "Quantity Updated" : "Added to Cart");
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart.");
    }
  };
  
  
  

  return (
    <UserContext.Provider value={{ user, wishlist: user?.wishlist || [], cart: user?.cart || [], updateWishlist, updateCart }}>
      {children}
      <ToastContainer />
    </UserContext.Provider>
  );
};

export default UserProvider;
