import React from "react";
import { Formik, Form } from "formik";
import InputField from "../../components/Input";
import { loginSchema } from "../../components/Validation";
import { useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../components/AxiosInstance";

const AdminLogin = () => {
  const navigate = useNavigate();


 const handleSubmit = async (values, { setSubmitting, setErrors }) => {
  try {
    const response = await axiosInstance.post("/Auth/login", values);
const user = response.data.result;
console.log("User data:", user.token,user);


if (user.role === "Admin") {
  sessionStorage.setItem("adminToken", JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role,
    token:user.token,  // ✅ correct token
    loggedInAt: new Date().getTime()
  }));

      navigate("/admin-dashboard", { replace: true });
      toast.success("Login successful!");
    } else {
      setErrors({ password: "You are not authorized as an admin" });
      toast.error("Unauthorized access");
    }
  } catch (error) {
    console.error("Login failed", error);
    if (error.response?.status === 401 || error.response?.status === 400) {
      setErrors({ password: "Invalid email or password" });
      toast.error("Invalid email or password");
    } else {
      toast.error("Login failed. Please try again.");
    }
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