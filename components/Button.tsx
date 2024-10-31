"use client";
import React from 'react';

interface ButtonProps {
  type: "button" | "submit" | "reset";
  label: string; 
  onClick?: () => void; 
  size?: 'sm' | 'md' | 'lg'; 
  variant?: 'primary' | 'secondary' | 'danger' | 'success'; 
  className?: string; 
  disabled?: boolean; 
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  size = 'md', 
  variant = 'primary', 
  className = '',
  disabled = false,
}) => {
  const baseStyles = "border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none transition ease-in-out";
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-md',
    lg: 'px-6 py-3 text-lg',
  };
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
