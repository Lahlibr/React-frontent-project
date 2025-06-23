import React from "react";

export const Input = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  name,
  className = "",
  ...rest
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
      {...rest}
    />
  );
};
