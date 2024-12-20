"use client";
import React from 'react';

interface InputFieldProps {
  label: string;
  type?: string;
  id: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | null | undefined; // Keep the original type definition
  error?: string; 
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  id,
  placeholder = '',
  maxLength,
  required = false,
  onChange,
  value,
  error, 
}) => (
  <div className="my-4">
    <label htmlFor={id} className="block text-md md:text-lg font-semibold text-onsurface">
      {label}
    </label>
    <input
      type={type}
      id={id}
      className={`mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none ${error ? 'border-red-500' : ''}`} // Add conditional styling for error
      placeholder={placeholder}
      maxLength={maxLength}
      required={required}
      onChange={onChange}
      value={value ?? ''} 
    />
    {error && ( 
      <p className="text-red-500 text-sm mt-1" aria-live="assertive">
        {error}
      </p>
    )}
  </div>
);

export default InputField;
