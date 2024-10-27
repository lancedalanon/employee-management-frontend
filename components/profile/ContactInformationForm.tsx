"use client";
import React from 'react';
import { User } from '@/types/userTypes';
import FieldDisplay from '@/components/profile/InputFieldDisplay';
import Button from '@/components/Button';

interface ContactInformationFormProps {
  user: User;
}

const ContactInformationForm: React.FC<ContactInformationFormProps> = ({ user }) => {
  return (
    <div className="w-full p-4 shadow-lg rounded-lg bg-surface border mb-8">
      <h1 className="text-4xl font-bold text-center">Contact Information</h1>
      <form>
        <div className="grid grid-cols-2 md:grid-cols-3 p-4 gap-4">
          <FieldDisplay label="Username" value={user.username} />
          <FieldDisplay label="Email" value={user.email} />
          <FieldDisplay label="Recovery Email" value={user.recovery_email || 'N/A'} />
          <FieldDisplay label="Phone Number" value={user.phone_number} />
          <FieldDisplay label="Emergency Contact Name" value={user.emergency_contact_name || 'N/A'} />
          <FieldDisplay label="Emergency Contact Number" value={user.emergency_contact_number || 'N/A'} />
        </div>
        <Button
          label="Update Contact Information"
          size="lg" 
          variant="primary"
          className="mt-4 w-full"
          onClick={() => console.log("Contact Information updated!")}
        />
      </form>
    </div>
  );
};

export default ContactInformationForm;
