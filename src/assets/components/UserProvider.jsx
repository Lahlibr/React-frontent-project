import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from './AxiosInstance';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      fetchCart();
      fetchWishlist();
    } else {
      // Load guest cart and wishlist
      const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
      const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist')) || [];
      setCart(guestCart);
      setWishlist(guestWishlist);
    }
  }, []);
  
  const login = async (userData) => {
  const updatedUser = {
    ...userData,
    cart: Array.isArray(userData.cart) ? userData.cart : [],
    wishlist: Array.isArray(userData.wishlist) ? userData.wishlist : [],
  };

  localStorage.setItem("user", JSON.stringify(updatedUser));
  setUser(updatedUser);

  // Merge guest cart to user cart
  const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];

  if (guestCart.length > 0) {
    for (const item of guestCart) {
      await axiosInstance.post(`/Cart/AddToCart`, {
        productId: item.id,
        quantity: item.quantity || 1,
      });
    }
    localStorage.removeItem('guestCart');
  }

  fetchCart();
  fetchWishlist();
};



const logout = () => {
  localStorage.removeItem("user");
  setUser(null);
  setCart([]);
  setWishlist([]);
  localStorage.removeItem("guestCart");
    localStorage.removeItem("guestWishlist");
};
  const fetchCart = async () => {
  if (!user) return;
  setLoadingCart(true);
  try {
    const res = await axiosInstance.get('/Cart/GetCartItems');
    const data = res?.data?.data;
    
    if (res.status === 200 && Array.isArray(data)) {
      setCart(data);
    } else {
      setCart([]); // fallback to empty array
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    setLoadingCart(false); // fallback on error
  }
};


  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.get('/wishlist/getwishlist');
      if (res.status === 200 && res.data.data) {
        setWishlist(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  // Update cart in storage (API for users, localStorage for guests)
 // In UserContext.js
const updateCart = async (product) => {
  if (isAdding) return false;
  setIsAdding(true);

  try {
    if (user?.token) {
      const isAlreadyInCart = cart.some(item => item.productId === product.id);
      if (isAlreadyInCart) {
        toast.info("Already in cart");
        setIsAdding(false);
        return false;
      }

      const res = await axiosInstance.post(`/Cart/AddToCart`, {
        productId: product.id,
        quantity: product.quantity || 1,
      });

      if (res.status === 200) {
        const newItem = {
          ...product,
          productId: product.id,
          quantity: product.quantity || 1
        };
        setCart(prev => [...prev, newItem]);
        toast.success('Item added to cart');
        return true;
      }
    } else {
      // Guest cart handling implementation
      const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
      const existingIndex = guestCart.findIndex(item => item.id === product.id);
      
      let updatedCart;
      if (existingIndex >= 0) {
        // If item exists, update quantity
        updatedCart = guestCart.map((item, index) => 
          index === existingIndex 
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      } else {
        // Add new item
        updatedCart = [...guestCart, { 
          ...product, 
          quantity: product.quantity || 1 
        }];
      }
      
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      setCart(updatedCart);
      toast.success('Item added to cart');
      return true;
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    toast.error('Failed to add to cart');
    return false;
  } finally {
    setIsAdding(false);
  }
};

// Add this new function to your context





  // Update wishlist
  const updateWishlist = async (product) => {
    try {
      if (user) {
         const alreadyExists = wishlist.some(item => item.productId === product.id);
  if (alreadyExists) {
    toast.info("Already in wishlist");
    return;
  }
        const res = await axiosInstance.post(`/wishlist/addtowishlist/${product.id}`);
        if (res.status === 200 && res.data.data) {
          setWishlist(res.data.data);
          toast.success('Wishlist updated');
        }
      } else {
        let updatedWishlist;
        const existingIndex = wishlist.findIndex(item => item.id === product.id);
        if (existingIndex >= 0) {
          updatedWishlist = wishlist.filter(item => item.id !== product.id);
        } else {
          updatedWishlist = [...wishlist, product];
        }
        setWishlist(updatedWishlist);
        localStorage.setItem('guestWishlist', JSON.stringify(updatedWishlist));
        toast.success('Wishlist updated');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <UserContext.Provider value={{
        user,
  wishlist,
  cart,
  isAdding,
  loadingCart,
  login,
  logout,
  updateCart,
  updateWishlist,

      // other context values
    }}>
      {children}
    </UserContext.Provider>
  );
};