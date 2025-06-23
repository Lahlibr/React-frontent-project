import React, { useContext } from "react";
import { ProductContext } from "../../components/ProductContext";

const SelectField = React.memo(({ label, name, value, onChange, error }) => {
  const { categories } = useContext(ProductContext);

  console.log("Categories from context:", categories); // ✅ Valid

  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
      >
        <option value="">Select category</option>
        {categories && categories.length > 0 ? (
          categories.map((cat) => (
            <option key={cat.categoryId ?? cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))
        ) : (
          <option key="loading" disabled>Loading categories...</option>
        )}
      </select>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
});

export default SelectField;
