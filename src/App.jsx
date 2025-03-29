import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./assets/user/home/Home";
import Registration from "./assets/user/home/Registration";
import Login from "./assets/user/home/Login";
import Categories from "./assets/user/categories/Categories";
import ProductCard from "./assets/user/Products/ProductCart";
import CartPage from "./assets/user/cart/Cart";
import WishlistPage from "./assets/user/wishlist/Wishlist";
import CheckoutPage from "./assets/user/payment/checkout";
import OrderList from "./assets/user/payment/order";
import ProductDetails from "./assets/user/Products/Product";
import UserProvider from "./assets/components/UserProvider";
import AdminLogin from "./assets/admin/components/AdminLogin";
import ProtectedRoute from "./assets/admin/ProtectedRoute";
import AdminDashboard from "./assets/admin/adminHome/Section";
import OrderPage from "./assets/admin/orders/orders";
import ProductsPage from "./assets/admin/products/ProductsPage";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<ProductCard />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}/>
          <Route path="/admin-orders" element={<ProtectedRoute><OrderPage /></ProtectedRoute>}/>
          <Route path="/admin-products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
