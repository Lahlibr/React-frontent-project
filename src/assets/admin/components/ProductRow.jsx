import React from "react";

const ProductRow = ({ product, handleRemove }) => {
  return (
    <tr className="border-b border-gray-600 hover:bg-gray-700 transition">
      <td className="p-3 flex items-center gap-3">
        <img src={product.img} alt={product.name} className="w-10 h-10 rounded-lg" />
        {product.name}
      </td>
      <td className="p-3 text-green-400">${product.price}</td>
      <td className="p-3">{product.categoryName}</td>
      <td className="p-3">{"Lahl ibrahim"}</td>
      <td className="p-3">{"29-03-25"}</td>
      <td className="p-3">
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
