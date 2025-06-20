import React from "react";

const ProductTable = ({ products, handleEdit, handleRemove }) => {
  return (
    <div className="overflow-x-auto border border-gray-200 shadow-md rounded-lg mt-4">
      <table className="min-w-full text-sm text-left bg-white">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="px-4 py-3">ProductName</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Real Price</th>
            <th className="px-4 py-3">Offer Price</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-6 text-gray-500">
                No products found.
              </td>
            </tr>
          ) : (
            products.map((product,index) => (
              <tr
                key={product.id || index}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2">{product.productName}</td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2 text-red-500 line-through">
                  ₹{product.price}
                </td>
                <td className="px-4 py-2 text-green-600 font-semibold">
                  ₹{product.offerPrice}
                </td>
                <td className="px-4 py-2">{product.type}</td>
                <td className="px-4 py-2">{product.rating}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
