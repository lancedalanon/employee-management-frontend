"use client";
import React, { useState, useEffect } from 'react';
import { User } from '@/types/userTypes';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FieldDisplay from '@/components/profile/InputFieldDisplay';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { updateContactInformation } from '@/store/userSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';

interface ContactInformationFormProps {
  user: User;
  onRefresh: () => void;
}

type ContactFormValues = {
  username: string;
  email: string;
  recovery_email?: string | null;
  phone_number: string;
  emergency_contact_name?: string | null;
  emergency_contact_number?: string | null;
};

// Validation schema
const schema: yup.ObjectSchema<ContactFormValues> = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .max(255, 'Username cannot exceed 255 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  recovery_email: yup
    .string()
    .nullable()
    .email('Invalid recovery email format'),
  phone_number: yup
    .string()
    .required('Phone number is required')
    .matches(/^09\d{2}-\d{3}-\d{4}$/, 'Phone number must be in the format 09XX-XXX-XXXX')
    .max(13, 'Phone number must be at most 13 characters long'),
  emergency_contact_name: yup
    .string()
    .nullable()
    .max(255, 'Emergency contact name cannot exceed 255 characters'),
  emergency_contact_number: yup
    .string()
    .nullable('Emergency contact phone number is required')
    .matches(/^09\d{2}-\d{3}-\d{4}$/, 'Emergency contact phone number must be in the format 09XX-XXX-XXXX')
    .max(13, 'Emergency contact phone number must be at most 13 characters long'),
});

const ContactInformationForm: React.FC<ContactInformationFormProps> = ({ user, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<ContactFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: user.username,
      email: user.email,
      recovery_email: user.recovery_email || null,
      phone_number: user.phone_number,
      emergency_contact_name: user.emergency_contact_name || null,
      emergency_contact_number: user.emergency_contact_number || null,
    },
  });

  // Watch form values to detect changes
  const formValues = watch();

  useEffect(() => {
    const initialValues = {
      username: user.username,
      email: user.email,
      recovery_email: user.recovery_email || null,
      phone_number: user.phone_number,
      emergency_contact_name: user.emergency_contact_name || null,
      emergency_contact_number: user.emergency_contact_number || null,
    };
    setIsModified(JSON.stringify(formValues) !== JSON.stringify(initialValues));
  }, [formValues, user]);

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await dispatch(updateContactInformation(data)).unwrap();
      reset();
      setIsModified(false);
      setIsEditing(false);
      onRefresh();
    } catch (error) {
      console.error("Error updating contact information:", error);
    }
  };

  // Reset form values on user prop update
  useEffect(() => {
    reset({
      username: user.username,
      email: user.email,
      recovery_email: user.recovery_email || null,
      phone_number: user.phone_number,
      emergency_contact_name: user.emergency_contact_name || null,
      emergency_contact_number: user.emergency_contact_number || null,
    });
  }, [user, reset]);

  const handleCancel = () => {
    setIsEditing(false);
    reset();
    setIsModified(false);
  };

  return (
    <div className="w-full p-4 shadow-lg rounded-lg bg-surface border mb-8">
      <h1 className="text-4xl font-bold text-center">Contact Information</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isEditing ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 p-4 gap-4">
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="username"
                    label="Username"
                    placeholder="Enter your username"
                    error={errors.username?.message}
                    {...field}
                    value={field.value}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="email"
                    label="Email"
                    placeholder="Enter your email"
                    error={errors.email?.message}
                    {...field}
                    value={field.value}
                  />
                )}
              />
              <Controller
                name="recovery_email"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="recovery-email"
                    label="Recovery Email"
                    placeholder="Enter recovery email"
                    error={errors.recovery_email?.message}
                    {...field}
                    value={field.value || null}
                  />
                )}
              />
              <Controller
                name="phone_number"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="phone-number"
                    label="Phone Number"
                    placeholder="Enter phone number"
                    error={errors.phone_number?.message}
                    {...field}
                    value={field.value}
                  />
                )}
              />
              <Controller
                name="emergency_contact_name"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="emergency-contact-name"
                    label="Emergency Contact Name"
                    placeholder="Enter emergency contact name"
                    error={errors.emergency_contact_name?.message}
                    {...field}
                    value={field.value || null}
                  />
                )}
              />
              <Controller
                name="emergency_contact_number"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="emergency-contact-number"
                    label="Emergency Contact Number"
                    placeholder="Enter emergency contact number"
                    error={errors.emergency_contact_number?.message}
                    {...field}
                    value={field.value || null}
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
                label="Update Contact Information"
                size="lg"
                variant="primary"
                className="mt-4 w-full"
                disabled={!isModified} // Disable if no changes
              />
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 p-4 gap-4">
            <FieldDisplay label="Username" value={user.username} />
            <FieldDisplay label="Email" value={user.email} />
            <FieldDisplay label="Recovery Email" value={user.recovery_email || 'N/A'} />
            <FieldDisplay label="Phone Number" value={user.phone_number} />
            <FieldDisplay label="Emergency Contact Name" value={user.emergency_contact_name || 'N/A'} />
            <FieldDisplay label="Emergency Contact Number" value={user.emergency_contact_number || 'N/A'} />
          </div>
        )}
        {!isEditing && (
          <Button
            type="button"
            label="Edit Contact Information"
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

export default ContactInformationForm;
