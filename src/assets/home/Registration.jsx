import { Formik, Form, Field, ErrorMessage } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
const Registration = () => {
  const navigate = useNavigate();
  const validationSch = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const res = await axios.get(`http://localhost:5000/users?email=${values.email}`);
      if (res.data.length > 0) {
        setFieldError("email", "Email already exists");
        setSubmitting(false);
        return;
      }

      const response = await axios.post("http://localhost:5000/users", values);
      console.log("User Registered:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Failed to register. Check console for details.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        <Formik initialValues={{ username: "", email: "", password: "" }} validationSchema={validationSch} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-sm font-bold">Username</label>
                <Field name="username" type="text" className="w-full p-2 border rounded" />
                <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold">Email</label>
                <Field name="email" type="email" className="w-full p-2 border rounded" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold">Password</label>
                <Field name="password" type="password" className="w-full p-2 border rounded" />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Register
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-sm mt-4">
          Already have an account? <a href="/login" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Registration;
