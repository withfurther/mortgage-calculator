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
  required?: boolean;
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
  required = false,
}) => {
  const [localValue, setLocalValue] = useState(value);

  // A helper function to format the value
  const formatValue = (val: string): string => {
    let formattedValue = val;

    const numericValue = parseFloat(val.replace(/[^0-9.-]/g, ""));

    if (isNaN(numericValue)) {
      return "";
    }

    if (isCurrency) {
      // Format as currency with commas
      formattedValue = `$${numericValue.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    } else if (isPercentage) {
      // Format as percentage with two decimals
      formattedValue = `${numericValue.toFixed(2)}%`;
    }

    return formattedValue;
  };

  useEffect(() => {
    // Whenever `value` changes from outside, format it
    // and update `localValue` so it displays formatted.
    setLocalValue(formatValue(value));
  }, [value]);

  const handleBlur = () => {
    const formatted = formatValue(localValue);
    setLocalValue(formatted);
    onChange(formatted);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Allow typing of partial values
    // The formatting will fully apply on blur
    // and after value updates from props
    if (allowNegative || /^[0-9.-]*$/.test(inputValue.replace(/[^0-9.-]/g, ""))) {
      setLocalValue(inputValue);
      // Note: We don't call onChange with formatted value here
      // because we only want to store the raw value until blur.
      onChange(inputValue);
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        className="border rounded px-2 py-1"
        type={type}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        step={step}
        required={required}
      />
    </div>
  );
};

export default InputField;