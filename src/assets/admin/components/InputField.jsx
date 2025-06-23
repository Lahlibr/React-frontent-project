import React from "react";

const InputField = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  error, 
  required = false,
  min,
  max,
  step,
  ...props 
}) => {
  const baseClasses = "w-full px-3 py-2 rounded border bg-gray-700 text-white";
  const errorClasses = error ? "border-red-500" : "border-gray-600";
  const focusClasses = "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-white mb-2 font-medium">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseClasses} ${errorClasses} ${focusClasses}`}
          rows={3}
          {...props}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className={`${baseClasses} ${errorClasses} ${focusClasses}`}
          {...props}
        />
      )}
      
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;