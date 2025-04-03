import React from "react";

const ProductTable = ({ products, handleRemove, handleEdit }) => {
  // Filter out soft-deleted products in the UI
  const visibleProducts = products.filter(product => !product.isDeleted);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 text-white border border-gray-700">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="px-6 py-3 text-left">Product</th>
            <th className="px-6 py-3 text-left">Category</th>
            <th className="px-6 py-3 text-left">Price</th>
            <th className="px-6 py-3 text-left">Type</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {visibleProducts.length > 0 ? (
            visibleProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-700">
                <td className="px-6 py-4 flex items-center space-x-3">
                  <img
                    src={product.images}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <span>{product.title}</span>
                </td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">${product.price}</td>
                <td className="px-6 py-4">{product.type}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md mr-2"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    onClick={() => handleRemove(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
