import { Formik, Form } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from "../../components/Input";
import { registrationSchema } from "../../components/Validation";
import { useCallback, useMemo } from "react";
import NavItems from "../../components/NavItems";

const Registration = () => {
  const navigate = useNavigate();
   
  const handleSubmit = useCallback(async (values, { setSubmitting, setFieldError }) => {
    try {
      const { data: users } = await axios.get("http://localhost:3001/users");
      if (users.some(user => user.email === values.email)) {
        setFieldError("email", "Email already exists");
        return;
      }

       ;
      await axios.post("http://localhost:3001/users", { ...values, wishlist: [], cart: [] });
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Failed to register.");
    } finally{
    setSubmitting(false);}
  },[navigate]);

  return (
    <><NavItems/>
    <div className="min-h-screen flex items-center justify-center bg-[url('images/registration.webp')] bg-cover bg-center">
      <div className="bg-white/50 backdrop-blur-sm p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <Formik initialValues={{ username: "", email: "", password: "" }} validationSchema={registrationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <InputField label="Username" name="username" />
              <InputField label="Email" name="email" type="email" />
              <InputField label="Password" name="password" type="password" />
              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Register
              </button>
            </Form>
          )}
        </Formik>
        <p className="text-sm mt-4">Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
      </div>
    </div></>
  );
};

export default Registration;
