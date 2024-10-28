"use client";
import React, { useState, useEffect } from 'react';
import { User } from '@/types/userTypes';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FieldDisplay from '@/components/profile/InputFieldDisplay';
import Button from '@/components/Button';
import InputField from '@/components/InputField';

interface PersonalInformationFormProps {
  user: User;
}

type FormValues = {
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  suffix?: string | null;
  place_of_birth: string;
  date_of_birth: string;
  gender: string;
};

const schema: yup.ObjectSchema<FormValues> = yup.object().shape({
  first_name: yup
    .string()
    .required('First name is required')
    .max(255, 'First name cannot exceed 255 characters')
    .matches(/^[\p{L}\s\-'\.]*$/u, 'Invalid characters in first name'),
  middle_name: yup
    .string()
    .nullable()
    .max(255, 'Middle name cannot exceed 255 characters')
    .matches(/^[\p{L}\s\-'\.]*$/u, 'Invalid characters in middle name'),
  last_name: yup
    .string()
    .required('Last name is required')
    .max(255, 'Last name cannot exceed 255 characters')
    .matches(/^[\p{L}\s\-'\.]*$/u, 'Invalid characters in last name'),
  suffix: yup
    .string()
    .nullable()
    .max(255, 'Suffix cannot exceed 255 characters')
    .matches(/^[\p{L}\s\-'\.]*$/u, 'Invalid characters in suffix'),
  place_of_birth: yup
    .string()
    .required('Place of birth is required')
    .max(255, 'Place of birth cannot exceed 255 characters'),
  date_of_birth: yup
    .string()
    .required('Date of birth is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format')
    .test('is-date', 'Date of birth must be a valid date', (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime()) && date < new Date(); 
    }),
  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(['Male', 'Female'], 'Gender must be either Male or Female'),
});

const PersonalInformationForm: React.FC<PersonalInformationFormProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModified, setIsModified] = useState(false); // Track if the form is modified

  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: user.first_name,
      middle_name: user.middle_name || null,
      last_name: user.last_name,
      suffix: user.suffix || null,
      place_of_birth: user.place_of_birth,
      date_of_birth: user.date_of_birth, 
      gender: user.gender,
    },
  });

  // Watch all form values to detect changes
  const formValues = watch();

  useEffect(() => {
    // Check if the current form values differ from the initial values
    const initialValues = {
      first_name: user.first_name,
      middle_name: user.middle_name || null,
      last_name: user.last_name,
      suffix: user.suffix || null,
      place_of_birth: user.place_of_birth,
      date_of_birth: user.date_of_birth, 
      gender: user.gender,
    };

    setIsModified(JSON.stringify(formValues) !== JSON.stringify(initialValues));
  }, [formValues, user]);

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    // Perform your submission logic here...

    // Reset form and state
    reset();
    setIsModified(false); // Reset modified state after successful submission
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset(); // Reset form values
    setIsModified(false); // Reset modified state on cancel
  };

  return (
    <div className="w-full p-4 shadow-lg rounded-lg bg-surface border mb-8">
      <h1 className="text-4xl font-bold text-center">Personal Information</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isEditing ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 p-4 gap-4">
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="first-name"
                    label="First Name"
                    placeholder="Enter your first name"
                    error={errors.first_name?.message}
                    {...field}
                    value={field.value}
                  />
                )}
              />
              <Controller
                name="middle_name"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="middle-name"
                    label="Middle Name"
                    placeholder="Enter your middle name"
                    error={errors.middle_name?.message}
                    {...field}
                    value={field.value || null} 
                  />
                )}
              />
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="last-name"
                    label="Last Name"
                    placeholder="Enter your last name"
                    error={errors.last_name?.message}
                    {...field}
                    value={field.value}
                  />
                )}
              />
              <Controller
                name="suffix"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="suffix"
                    label="Suffix"
                    placeholder="Enter suffix"
                    error={errors.suffix?.message}
                    {...field}
                    value={field.value || null}
                  />
                )}
              />
              <Controller
                name="place_of_birth"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="place-of-birth"
                    label="Place of Birth"
                    placeholder="Enter place of birth"
                    error={errors.place_of_birth?.message}
                    {...field}
                    value={field.value}
                  />
                )}
              />
              <Controller
                name="date_of_birth"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="date-of-birth"
                    label="Date of Birth"
                    type="date"
                    error={errors.date_of_birth?.message}
                    {...field}
                    value={field.value}
                  />
                )}
              />
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="gender"
                    label="Gender"
                    placeholder="Enter gender"
                    error={errors.gender?.message}
                    {...field}
                    value={field.value}
                  />
                )}
              />
            </div>
            <div className="flex justify-center items-center">
              <Button
                type="button"
                label="Cancel"
                size="lg"
                variant="secondary"
                className="mt-4 w-full mr-4"
                onClick={handleCancel}
              />
              <Button
                type="submit"
                label="Update Personal Information"
                size="lg"
                variant="primary"
                className="mt-4 w-full"
                disabled={!isModified} // Disable button if no changes are made
              />
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 p-4 gap-4">
            <FieldDisplay label="First Name" value={user.first_name} />
            <FieldDisplay label="Middle Name" value={user.middle_name || 'N/A'} />
            <FieldDisplay label="Last Name" value={user.last_name} />
            <FieldDisplay label="Suffix" value={user.suffix || 'N/A'} />
            <FieldDisplay label="Place of Birth" value={user.place_of_birth} />
            <FieldDisplay label="Date of Birth" value={user.date_of_birth} />
            <FieldDisplay label="Gender" value={user.gender} />
          </div>
        )}
        {!isEditing && (
          <Button
            type="button"
            label="Edit Personal Information"
            size="lg"
            variant="primary"
            className="mt-4 w-full"
            onClick={() => setIsEditing(true)}
          />
        )}
      </form>
    </div>
  );
};

export default PersonalInformationForm;
