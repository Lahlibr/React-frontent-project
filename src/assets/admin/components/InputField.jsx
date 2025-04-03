import React from "react";

const InputField = React.memo(({ label, name, type = "text", value, onChange, error }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold mb-2 text-white">{label}</label>
    <input
      name={name}
      type={type}
      value={value || ""}
      onChange={onChange}
      className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
));

export default InputField;