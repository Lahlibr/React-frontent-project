import { Formik, Form } from "formik";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from "../../components/Input";
import { loginSchema } from "../../components/Validation";
import NavItems from "../../components/NavItems";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const mergeCarts = (userCart, guestCart) => {
  const mergedCart = [...userCart];

  guestCart.forEach((guestItem) => {
    const existingItem = mergedCart.find((item) => item.id === guestItem.id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 0) + (guestItem.quantity || 1); 
    } else {
      mergedCart.push({ ...guestItem, quantity: guestItem.quantity || 1 });
    }
  });

  return mergedCart;
};

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (values, { setSubmitting }) => {
    try {
      const { data: users } = await axios.get("http://localhost:3001/users");
      const user = users.find((u) => u.email === values.email && u.password === values.password);
  
      if (user) {
        if (user.blocked) {
          toast.error("Your account has been blocked.");
        } else {
          // Retrieve guest cart
          const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
  
          // Merge guest cart with user's cart
          const updatedCart = mergeCarts(user.cart || [], guestCart);
  
          // Update user cart in db.json
          const updatedUser = { ...user, cart: updatedCart };
          await axios.patch(`http://localhost:3001/users/${user.id}`, { cart: updatedCart });
  
          // Store updated user in localStorage
          localStorage.setItem("user", JSON.stringify(updatedUser));
  
          // Remove guest cart from localStorage
          localStorage.removeItem("guestCart");
  
          toast.success("Login successful!");
          navigate("/");
        }
      } else {
        toast.error("Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [navigate]);

  return (
    <>
      <NavItems />
      <div className="min-h-screen flex items-center justify-center bg-[url('images/login.avif')] bg-cover bg-center">
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <Formik 
            initialValues={{ email: "", password: "" }} 
            validationSchema={loginSchema} 
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField label="Email" name="email" type="email" />
                <InputField label="Password" name="password" type="password" />
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full bg-blue-500 text-white p-2 mt-2.5 rounded hover:bg-blue-600"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>
          <p className="text-sm mt-4">
            Don't have an account? <a href="/registration" className="text-blue-500">Register</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;