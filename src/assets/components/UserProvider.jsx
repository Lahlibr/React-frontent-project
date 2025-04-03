import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setCart(storedUser.cart || []);
      setWishlist(storedUser.wishlist || []);
    } else {
      // Load guest cart and wishlist
      const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
      const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist')) || [];
      setCart(guestCart);
      setWishlist(guestWishlist);
    }
  }, []);

  // Update cart in storage (API for users, localStorage for guests)
  const updateCart = async (product) => {
    try {
      let updatedCart;
      const existingItemIndex = cart.findIndex(item => item.id === product.id);
  
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        updatedCart = cart.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: (item.quantity || 1) + 1 } 
            : item
        );
      } else {
        // Add new item to cart with quantity 1
        updatedCart = [...cart, { ...product, quantity: 1 }];
      }
  
      if (user) {
        // Update in API for logged-in users
        await axios.patch(`http://localhost:3001/users/${user.id}`, {
          cart: updatedCart
        });
        const updatedUser = { ...user, cart: updatedCart };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        // Update localStorage for guest users
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      }
  
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
      return cart; // Return current cart on error
    }
  };

  // Update wishlist
  const updateWishlist = async (product) => {
    try {
      let updatedWishlist;
      const existingItemIndex = wishlist.findIndex(item => item.id === product.id);

      if (existingItemIndex >= 0) {
        // Remove item from wishlist if it exists
        updatedWishlist = wishlist.filter((_, index) => index !== existingItemIndex);
      } else {
        // Add new item to wishlist
        updatedWishlist = [...wishlist, product];
      }

      if (user) {
        // Update in API for logged-in users
        await axios.patch(`http://localhost:3001/users/${user.id}`, {
          wishlist: updatedWishlist
        });
        const updatedUser = { ...user, wishlist: updatedWishlist };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        // Update localStorage for guest users
        localStorage.setItem('guestWishlist', JSON.stringify(updatedWishlist));
      }

      setWishlist(updatedWishlist);
      return updatedWishlist;
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
      return wishlist; // Return current wishlist on error
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      wishlist,
      cart,
      updateCart,
      updateWishlist,
      // other context values
    }}>
      {children}
    </UserContext.Provider>
  );
};