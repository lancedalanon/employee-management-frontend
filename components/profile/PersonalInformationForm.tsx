"use client";
import React from 'react';
import { User } from '@/types/userTypes';
import FieldDisplay from '@/components/profile/InputFieldDisplay';
import Button from '@/components/Button';

interface PersonalInformationFormProps {
  user: User;
}

const PersonalInformationForm: React.FC<PersonalInformationFormProps> = ({ user }) => {
  return (
    <div className="w-full p-4 shadow-lg rounded-lg bg-surface border mb-8">
      <h1 className="text-4xl font-bold text-center">Personal Information</h1>
      <form>
        <div className="grid grid-cols-2 md:grid-cols-3 p-4 gap-4">
          <FieldDisplay label="First Name" value={user.first_name} />
          <FieldDisplay label="Middle Name" value={user.middle_name || 'N/A'} />
          <FieldDisplay label="Last Name" value={user.last_name} />
          <FieldDisplay label="Suffix" value={user.suffix || 'N/A'} />
          <FieldDisplay label="Place of Birth" value={user.place_of_birth} />
          <FieldDisplay label="Date of Birth" value={user.date_of_birth} />
          <FieldDisplay label="Gender" value={user.gender} />
        </div>
        <Button
          label="Update Personal Information"
          size="lg" 
          variant="primary"
          className="mt-4 w-full"
          onClick={() => console.log("Personal Information updated!")}
        />
      </form>
    </div>
  );
};

export default PersonalInformationForm;
