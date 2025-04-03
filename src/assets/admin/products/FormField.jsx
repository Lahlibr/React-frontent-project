import FormField from "./FormField";
import FormSubmitButton from "./FormSubmitButton";

const FORM_FIELDS = [
  { type: "text", name: "title", label: "Product Title", required: true },
  { type: "text", name: "description", label: "Description" },
  { type: "select", name: "category", label: "Category", required: true },
  { type: "number", name: "price", label: "Price", required: true },
  { type: "number", name: "offerPrice", label: "Offer Price" },
  { type: "radio", name: "type", label: "Product Type", options: ["Veg", "Non-Veg"] },
  { type: "number", name: "rating", label: "Rating" },
  { type: "text", name: "images", label: "Image URLs (comma-separated)" }
];

const ProductForm = ({ formData, errors, onChange, onSubmit, isEdit }) => {
  return (
    <form onSubmit={onSubmit} className="p-6 bg-gray-800 rounded-lg">
      {FORM_FIELDS.map((field) => (
        <FormField
          key={field.name}
          type={field.type}
          name={field.name}
          label={field.label}
          value={formData[field.name]}
          error={errors[field.name]}
          required={field.required}
          options={field.options}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      ))}
      <FormSubmitButton isEdit={isEdit} />
    </form>
  );
};

export default ProductForm;