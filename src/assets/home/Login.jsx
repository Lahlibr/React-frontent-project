import { Formik, Form } from "formik";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from "../components/Input";
import { loginSchema } from "../components/Validation";
import NavItems from "../components/NavItems";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (values, { setSubmitting }) => {
    try {
      const { data: users } = await axios.get("http://localhost:3001/users");
      const user = users.find(user => user.email === values.email && user.password === values.password);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
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
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white p-2 mt-2.5 rounded hover:bg-blue-600">
                  Login
                </button>
              </Form>
            )}
          </Formik>
          <p className="text-sm mt-4">Don't have an account? <a href="/registration" className="text-blue-500">Register</a></p>
        </div>
      </div>
    </>
  );
};

export default Login;
