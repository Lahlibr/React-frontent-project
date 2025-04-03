import React, { useContext } from "react";
import { ProductContext } from "../../components/ProductContext";

const SelectField = React.memo(({ label, name, value, onChange, error }) => {
  const { categories } = useContext(ProductContext); // ✅ Correct way to use categories

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
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))
        ) : (
          <option disabled>Loading categories...</option>
        )}
      </select>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
});

export default SelectField;
