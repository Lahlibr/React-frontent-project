import React, { useState } from "react";
import axiosInstance from "../../components/AxiosInstance";

const AddAddressForm = ({ onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    FullName: "",
    HouseName: "",
    Landmark: "",
    PhoneNumber: "",
    Pincode: "",
    Place: "",
    PostOffice: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }

    const response = await axiosInstance.post("/Address/Add", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    const added = response?.data?.data;
    console.log("Fetched addresses:", response?.data?.data);
    if (added) onSuccess(added);
  } catch (error) {
    console.error("Failed to add address:", error?.response?.data || error);
    alert("Failed to add address. Please try again.");
  }
};


  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-lg font-semibold">Add New Address</h2>
      {[
        { label: "Full Name", name: "FullName" },
        { label: "Phone Number", name: "PhoneNumber", type: "tel" },
        { label: "Pincode", name: "Pincode", type: "text" },
        { label: "House Name", name: "HouseName" },
        { label: "Place", name: "Place" },
        { label: "Post Office", name: "PostOffice" },
        { label: "Landmark", name: "Landmark" },
      ].map(({ label, name, type = "text" }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      ))}

      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded text-sm bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Save Address
        </button>
      </div>
    </form>
  );
};

export default AddAddressForm;
