import React from "react";
import { Formik, Form } from "formik";
import InputField from "../../components/Input";
import { loginSchema } from "../../components/Validation";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch("http://localhost:3001/admin");
      const users = await response.json();
      const admin = users.find(
        (user) => user.email === values.email && user.password === values.password && user.role === "admin"
      );
      if (admin) {
        sessionStorage.setItem("admin", JSON.stringify(admin));
        navigate("/admin-dashboard");
      } else {
        setErrors({ email: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login failed", error);
    }
    setSubmitting(false);
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg bg-white rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
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
              className="w-full bg-blue-600 text-white p-2 rounded mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
export default AdminLogin;