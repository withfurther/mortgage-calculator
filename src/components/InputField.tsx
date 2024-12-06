import React, { useState, useEffect } from "react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  step?: number;
  isPercentage?: boolean;
  isCurrency?: boolean;
  allowNegative?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  step,
  isPercentage = false,
  isCurrency = false,
  allowNegative = false,
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    let formattedValue = localValue;
    if (isCurrency) {
      formattedValue = `$${parseFloat(localValue.replace(/[^0-9.-]/g, "")).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    } else if (isPercentage) {
      const parsedValue = parseFloat(localValue.replace(/[^0-9.-]/g, ""));
      formattedValue = `${parsedValue.toFixed(2)}%`;
    }
    setLocalValue(formattedValue);
    onChange(formattedValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    if (isPercentage || isCurrency) {
      if (inputValue === ".") inputValue = "0.";
    }
    if (allowNegative || /^[0-9.-]*$/.test(inputValue)) {
      setLocalValue(inputValue);
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        className="border rounded px-2 py-1"
        type={type}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        step={step}
      />
    </div>
  );
};

export default InputField;