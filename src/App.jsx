import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./assets/home/Home";
import Registration from "./assets/home/Registration";
import Login from "./assets/home/Login";
import Section1 from "./assets/home/Section1";
import Categories from "./assets/categories/Categories";
import Reviews from "./assets/components/Reviews";
import ProductCard from "./assets/Products/ProductCart";
import Footer from "./assets/components/Footer";
import CartPage from "./assets/cart/Cart";
import WishlistPage from "./assets/wishlist/Wishlist";
import CheckoutPage from "./assets/payment/checkout";
import OrderList from "./assets/payment/order";
import ProductDetails from "./assets/Products/Product";
import Search from "./assets/components/Search";
import InputField from "./assets/components/Input";
import UserProvider from "./assets/components/UserProvider";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/section" element={<Section1 />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<ProductCard />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/search" element={<Search />} />
          <Route path="/input" element={<InputField />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
