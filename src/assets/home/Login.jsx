import { ErrorMessage, Field, Formik , Form} from 'formik';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup"
import axios from 'axios';
const Login = () => {
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    email:Yup.string().email("Invalid Email").required("Email is required"),
    password:Yup.string().required("Password is required")
  });
  const handleSubmit = async (values,{setSubmitting})=>{
    try{
      const response = await axios.get("http://localhost:5000/users")
      const users = response.data;
      const user = users.find(
        (user) => user.email === values.email && user.password === values.password
      );
      if(user){
        console.log("Login successfull",user);
        navigate("/");
      }else{
        alert("Invalid credentials");
      }
    }catch (error){
      console.error("Login error:",error)
    }setSubmitting(false);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <Formik 
        initialValues={{email:"",password:""}}
        validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting})=>(
            <Form>
              <div>
                <label className='block text-sm font-bold'>Email</label>
                <Field name="email" type="email" className="w-full p-2 border rounded" />
                <ErrorMessage name="email" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className='block text-sm font-bold'>Password</label>
                <Field name="password" type='password' className="w-full p-2 border rounded"/>
                <ErrorMessage name='password'  className="text-red-500 text-sm" />
              </div>
              <button type='submit' disabled={isSubmitting} className='w-full bg-blue-500 text-white p-2 mt-2.5 rounded hover:bg-red-600'>Login</button>
            </Form>
          )}
        </Formik>
        <p className="text-sm mt-4">
          Don't have an account? <a href="/registration" className="text-blue-500">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login
