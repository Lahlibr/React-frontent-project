import React from "react";

export const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  variant = "primary",
}) => {
  const baseStyles =
    "rounded-xl px-4 py-2 font-medium transition duration-200";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-black hover:bg-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
