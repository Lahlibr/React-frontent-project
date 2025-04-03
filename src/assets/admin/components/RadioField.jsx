import React from 'react';

const RadioField = React.memo(({ label, name, value, onChange, options, error }) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>
    <div className="flex space-x-6">
      {options.map((option) => (
        <label key={option}>
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={onChange}
          />
          {option}
        </label>
      ))}
    </div>
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
));

export default RadioField;
