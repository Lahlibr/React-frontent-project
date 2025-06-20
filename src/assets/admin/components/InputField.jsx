import React from "react";
import { useField } from "formik";

const InputField = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="flex flex-col">
      <label htmlFor={props.name} className="mb-1 font-medium">{label}</label>
      <input
        {...field}
        {...props}
        className={`p-2 border rounded ${
          meta.touched && meta.error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
};

export default InputField;
