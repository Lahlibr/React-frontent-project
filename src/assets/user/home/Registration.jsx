// src/pages/Auth/Registration.jsx
import { Formik, Form } from "formik";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../components/AxiosInstance"; // Use the configured axios
import InputField from "../../components/Input";
import { registrationSchema } from "../../components/Validation";
import NavItems from "../../components/NavItems";
import { toast } from "react-toastify";
import { useCallback } from "react";

const Registration = () => {
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await axiosInstance.post("/Auth/register", {
          username: values.username,
          email: values.email,
          password: values.password,
        });

        if (response.data.success) {
          toast.success(response.data.message);
          navigate("/login");
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400 && error.response.data.errors?.email) {
            setFieldError("email", error.response.data.errors.email);
          } else {
            toast.error(error.response.data.message || "Registration failed");
          }
        } else {
          console.error("Network error:", error);
          toast.error("Cannot connect to server. Please try again later.");
        }
      } finally {
        setSubmitting(false);
      }
    },
    [navigate]
  );

  return (
    <>
      <NavItems />
      <div className="min-h-screen flex items-center justify-center bg-[url('images/registration.webp')] bg-cover bg-center">
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4">Registration</h2>
          <Formik
            initialValues={{ username: "", email: "", password: "" }}
            validationSchema={registrationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField label="Username" name="username" />
                <InputField label="Email" name="email" type="email" />
                <InputField label="Password" name="password" type="password" />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-3"
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </button>
              </Form>
            )}
          </Formik>
          <p className="text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Registration;
