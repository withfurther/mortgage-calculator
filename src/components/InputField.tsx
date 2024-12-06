import React, { useState } from "react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  step?: number;
  isPercentage?: boolean;
  allowNegative?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  step,
  isPercentage = false,
  allowNegative = false,
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleBlur = () => {
    let formattedValue = inputValue;

    if (isPercentage) {
      const numericValue = parseFloat(formattedValue.replace(/[^0-9.-]/g, ""));
      if (!isNaN(numericValue)) {
        formattedValue = `${numericValue.toFixed(2)}%`;
      } else {
        formattedValue = "";
      }
    }

    setInputValue(formattedValue);
    onChange(formattedValue.replace("%", ""));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (allowNegative) {
      newValue = newValue.replace(/[^0-9.-]/g, "");
    } else {
      newValue = newValue.replace(/[^0-9.]/g, "");
    }

    if (newValue.startsWith(".")) {
      newValue = "0" + newValue;
    }

    setInputValue(newValue);
    onChange(newValue.replace("%", ""));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        className="w-full border rounded p-2"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        step={step}
      />
    </div>
  );
};

export default InputField;