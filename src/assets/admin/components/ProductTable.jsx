import React, { memo } from "react";

const ProductTable = memo(({ products, handleEdit, handleRemove }) => {
  return (
    <div className="overflow-x-auto border border-gray-600 shadow-md rounded-lg mt-4">
      <table className="min-w-full text-sm text-left bg-gray-800 text-white">
        <thead className="bg-gray-700 text-gray-200 font-semibold">
          <tr>
            <th className="px-4 py-3">Product Name</th>
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
              <td colSpan="7" className="text-center py-8 text-gray-400">
                No products found.
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr
                key={product.id || index}
                className="border-t border-gray-600 hover:bg-gray-700 transition-colors"
              >
                <td className="px-4 py-3">{product.title}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3 text-red-400 line-through">
                  ₹{product.price}
                </td>
                <td className="px-4 py-3 text-green-400 font-semibold">
                  ₹{product.offerPrice || product.price}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    product.type === 'Veg' ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {product.type || 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-3">{product.rating || 'N/A'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});

ProductTable.displayName = 'ProductTable';

export default ProductTable;
