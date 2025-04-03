import React from 'react';

const ImageUpload = React.memo(({ value, onChange, previewImage, error }) => (
  <div>
    <label className="block text-sm font-medium">Product Image</label>
    <input
      type="text"
      name="images"
      placeholder="Enter image URL"
      value={value}
      onChange={onChange}
      className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
    />
    <p className="text-gray-400 text-xs">OR</p>
    <input
      type="file"
      accept="image/*"
      onChange={onChange}
      className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
    />
    {previewImage && (
      <img src={previewImage} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
    )}
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
));

export default ImageUpload;
