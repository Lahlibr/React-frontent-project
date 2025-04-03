import React from "react";

const ProductRow = ({ product, handleRemove, handleEdit }) => {
  return (
    <tr className="border-b border-gray-600 hover:bg-gray-700 transition">
      {/* Image Column */}
      <td className="p-3">
        <img src={product.images} alt={product.title} className="w-10 h-10 rounded-lg" />
      </td>

      {/* Product Name */}
      <td className="p-3">{product.title}</td>

      {/* Price */}
      <td className="p-3 text-green-400">${product.price}</td>

      {/* Category */}
      <td className="p-3">{product.category}</td>

      {/* Vendor */}
      <td className="p-3">{"Lahl Ibrahim"}</td>

      {/* Published Date */}
      <td className="p-3">{"29-03-25"}</td>

      {/* Actions */}
      <td className="p-3 flex gap-2">
        <button
          onClick={() => handleEdit(product)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
        >
          Edit
        </button>

        <button
          onClick={() => handleRemove(product.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;
