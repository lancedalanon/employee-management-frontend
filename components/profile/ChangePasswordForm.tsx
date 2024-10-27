"use client";
import React from 'react';
import InputField from '@/components/InputField';
import Button from '@/components/Button';

const ChangePasswordForm: React.FC = () => {
  return (
    <div className="w-full p-4 shadow-lg rounded-lg bg-surface border mb-8">
      <h1 className="text-4xl font-bold text-center">Change Password</h1>
      <div className="p-4 gap-4">
        <form>
          <InputField
            label="Current Password"
            type="password"
            id="current_password"
            placeholder="Enter your current password"
            maxLength={255}
            required
          />
          <InputField
            label="New Password"
            type="password"
            id="new_password"
            placeholder="Enter your new password"
            maxLength={255}
            required
          />
          <InputField
            label="Confirm Password"
            type="password"
            id="confirm_password"
            placeholder="Re-enter your new password"
            maxLength={255}
            required
          />
          <Button
            label="Update Password"
            size="lg" 
            variant="primary"
            className="mt-4 w-full"
            onClick={() => console.log("Password updated!")}
          />
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
