"use client";

import { X } from "lucide-react"; // Import clear icon
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React, { useState } from "react";

// interface CustomSelectProps {
//   options: { value: string; label: string }[];
//   value: string;
//   onChange: (selected: { value: string; label: string } | null) => void;
//   placeholder?: string;
//   required?: boolean;
//   title?: string;
//   error?:string

// }

const CustomSelect = (props) => {
  const {
    options,
    value,
    onChange,
    placeholder = "Select an option",
    title,
    required,
    error,
    disabled,
    className,
  } = props;
  const selectedOption = options?.find((option) => option.value === value);

  return (
    <div className={`w-full ${className || ""}`}>
      {title && (
        <label className="block text-sm font-bold text-gray-700 mb-2">
          {title} {required && <span className="text-dred">*</span>}
        </label>
      )}
      <div className="relative">
        <Select
          onValueChange={(val) => {
            const selected = options?.find((option) => option.value === val);
            if (selected) {
              onChange(selected);
            }
          }}
          value={value}
          disabled={disabled}
        >
          <SelectTrigger
            hasValue={!!selectedOption && !disabled}
            onClear={() => onChange(null)}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && (
        <p className="mt-2 text-sm text-dred">
          {error} {/* Display the error message if it exists */}
        </p>
      )}
    </div>
  );
};

export default CustomSelect;
