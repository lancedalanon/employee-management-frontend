"use client";
import React from 'react';
import InputField from '@/components/InputField';
import Button from '@/components/Button';

const ApiKeyForm: React.FC = () => {
  return (
    <div className="w-full p-4 shadow-lg rounded-lg bg-surface border mb-8">
      <h1 className="text-4xl font-bold text-center">API Key</h1>
      <div className="p-4 gap-4">
        <form>
          <InputField
            label="API Key"
            type="password"
            id="api_key"
            placeholder="Enter your API Key"
            maxLength={255}
            required
          />
          <Button
            label="Update API Key"
            size="lg" 
            variant="primary"
            className="mt-4 w-full"
            onClick={() => console.log("API Key updated!")}
          />
        </form>
      </div>
    </div>
  );
};

export default ApiKeyForm;
