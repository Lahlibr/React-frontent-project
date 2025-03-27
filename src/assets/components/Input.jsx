import React from "react";
import { Field, ErrorMessage } from "formik";
//React.memo ensures the component re-renders only if label, name, or type changes.
const InputField = React.memo(({ label, name, type = "text" }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold">{label}</label>
    <Field name={name} type={type} className="w-full p-2 border rounded" />
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
  </div>
));

export default InputField;
