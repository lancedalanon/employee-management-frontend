"use client";
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => (
  <div className="flex justify-center items-center p-4">
    <span className="loader"></span>
    <p className="ml-2 text-onsurface">{message}</p>
  </div>
);

export default LoadingSpinner;
