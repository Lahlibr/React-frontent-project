import React from "react";
import ProductRow from "./ProductRow";

const ProductTable = ({ products, handleRemove }) => {
  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg p-4 shadow-lg">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-3 text-left border-b border-gray-600">Product Name</th>
            <th className="p-3 text-left border-b border-gray-600">Price</th>
            <th className="p-3 text-left border-b border-gray-600">Category</th>
            <th className="p-3 text-left border-b border-gray-600">Vendor</th>
            <th className="p-3 text-left border-b border-gray-600">Published On</th>
            <th className="p-3 text-left border-b border-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-400">No products found.</td>
            </tr>
          ) : (
            products.map((product) => (
              <ProductRow key={product.id} product={product} handleRemove={handleRemove} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
