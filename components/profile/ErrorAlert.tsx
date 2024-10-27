"use client";
import React from 'react';

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => (
  <div className="text-red-500 text-center p-4 border border-red-400 bg-red-100 rounded">
    <p>{message}</p>
  </div>
);

export default ErrorAlert;
