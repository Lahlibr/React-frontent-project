import { Formik, Form, Field } from "formik";
import { useCallback, useEffect, useMemo, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "../../components/Input";
import { loginSchema } from "../../components/Validation";
import NavItems from "../../components/NavItems";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../components/AxiosInstance";
import { UserContext } from "../../components/UserProvider";

// Utility function to merge guest and user carts
const mergeCarts = (userCart, guestCart) => {
  const safeUserCart = Array.isArray(userCart) ? userCart : [];
  const mergedCart = [...safeUserCart];
  guestCart.forEach((guestItem) => {
    const existingItem = mergedCart.find((item) => item.id === guestItem.id);
    if (existingItem) {
      existingItem.quantity =
        (existingItem.quantity || 0) + (guestItem.quantity || 1);
    } else {
      mergedCart.push({ ...guestItem, quantity: guestItem.quantity || 1 });
    }
  });
  return mergedCart;
};

const Login = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  // Check token expiration on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isOnLoginPage = window.location.pathname === "/login";

    if (token && !isOnLoginPage) {
      try {
        const { exp } = jwtDecode(token);
        if (Date.now() >= exp * 1000) {
          localStorage.removeItem("token");
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        }
      } catch (err) {
        console.error("Invalid token:", err.message);
        localStorage.removeItem("token");
      }
    }
  }, [navigate]);

  const initialValues = useMemo(() => ({ email: "", password: "" }), []);

  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
      try {
        const response = await axiosInstance.post("/Auth/login", {
          email: values.email,
          password: values.password,
        });

        const result = response?.data?.result;
        const token = result?.token;

        console.log("Login result:", result); // DEBUGGING

        if (!token || !result) {
          toast.error("Login failed: No token received.");
          return;
        }

        // Store login info in context and localStorage
        login(result);

        const userData = {
          id: result.id,
          username: result.name,
          email: result.email,
          role: result.role,
          token: token,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);

        toast.success("Login successful!");

        // Merge guest cart if exists
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

        if (guestCart.length > 0) {
          try {
            const cartResponse = await axiosInstance.get("Cart/GetCartItems", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const userCart = cartResponse.data || [];
            const mergedCart = mergeCarts(userCart, guestCart);

            await axiosInstance.post("/Cart/AddToCart", mergedCart, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            localStorage.removeItem("guestCart");
          } catch (mergeError) {
            console.error("Cart merge failed:", mergeError);
            toast.warning("Cart sync failed, but login was successful.");
          }
        }

        // Role-based redirection
        if (result.role?.toLowerCase() === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } catch (error) {
        const backendMessage = error.response?.data?.message;

        if (error.response?.status === 401) {
          toast.error(backendMessage || "Invalid email or password.");
        } else if (error.response?.status === 403) {
          toast.error("Your account has been blocked.");
        } else {
          toast.error("Login failed. Please try again.");
        }

        console.error("Login error:", error);
      } finally {
        setSubmitting(false);
      }
    },
    [navigate, login]
  );

  return (
    <>
      <NavItems />
      <div className="min-h-screen flex items-center justify-center bg-[url('images/login.avif')] bg-cover bg-center">
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <Formik
            initialValues={initialValues}
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
            Don't have an account?{" "}
            <Link to="/registration" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
