"use client";
import React from 'react';

interface TextAreaFieldProps {
  label: string;
  id: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string | null | undefined; // Keep the original type definition
  error?: string; 
  rows?: number; // Optional rows prop for textarea
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  id,
  placeholder = '',
  maxLength,
  required = false,
  onChange,
  value,
  error,
  rows = 3, // Default rows for textarea
}) => (
  <div className="my-4">
    <label htmlFor={id} className="block text-md md:text-lg font-semibold text-onsurface">
      {label}
    </label>
    <textarea
      id={id}
      className={`mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none ${error ? 'border-red-500' : ''}`}
      placeholder={placeholder}
      maxLength={maxLength}
      required={required}
      onChange={onChange}
      value={value ?? ''}
      rows={rows} // Apply rows if it's a textarea
    />
    {error && ( 
      <p className="text-red-500 text-sm mt-1" aria-live="assertive">
        {error}
      </p>
    )}
  </div>
);

export default TextAreaField;
