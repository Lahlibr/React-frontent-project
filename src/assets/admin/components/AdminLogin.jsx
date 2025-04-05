import React from "react";
import { Formik, Form } from "formik";
import InputField from "../../components/Input";
import { loginSchema } from "../../components/Validation";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch("http://localhost:3001/admin");
      if (!response.ok) throw new Error("Failed to fetch admin data");
      
      const users = await response.json();
      const admin = users.find(
        user => user.email === values.email && 
               user.password === values.password && 
               user.role === "admin"
      );

      if (admin) {
        // Store minimal required data in sessionStorage
        sessionStorage.setItem("adminToken", JSON.stringify({
          id: admin.id,
          email: admin.email,
          role: admin.role,
          loggedInAt: new Date().getTime()
        }));
        
        // Redirect to intended page or dashboard
        const from = location.state?.from?.pathname || "/admin-dashboard";
        navigate(from, { replace: true });
        toast.success("Login successful!");
      } else {
        setErrors({ email: " ", password: "Invalid credentials" });
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
          <Form className="space-y-4">
            <InputField label="Email" name="email" type="email" />
            <InputField label="Password" name="password" type="password" />
            <button
              type="submit"
              className={`w-full bg-blue-600 text-white p-2 rounded mt-4 ${isSubmitting ? 'opacity-70' : 'hover:bg-blue-700'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AdminLogin;