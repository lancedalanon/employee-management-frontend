"use client";
import React from 'react';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { updatePassword } from '@/store/userSlice';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type ChangePasswordFormValues = {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
};

// Validation schema
const schema = yup.object().shape({
  old_password: yup
    .string()
    .required('Current password is required'),
  new_password: yup
    .string()
    .required('New password is required')
    .min(6, 'New password must be at least 6 characters'),
    new_password_confirmation: yup
    .string()
    .oneOf([yup.ref('new_password')], 'Passwords must match') 
    .required('Confirm password is required'),
});

const ChangePasswordForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { control, handleSubmit, formState: { errors }, reset } = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      old_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await dispatch(updatePassword(data)).unwrap();
      reset();
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className="w-full p-4 shadow-lg rounded-lg bg-surface border mb-8">
      <h1 className="text-4xl font-bold text-center">Change Password</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 gap-4">
          <Controller
            name="old_password"
            control={control}
            render={({ field }) => (
              <InputField
                label="Current Password"
                type="password"
                id="old-password"
                placeholder="Enter your current password"
                error={errors.old_password?.message}
                maxLength={255}
                required
                {...field}
              />
            )}
          />
          <Controller
            name="new_password"
            control={control}
            render={({ field }) => (
              <InputField
                label="New Password"
                type="password"
                id="new-password"
                placeholder="Enter your new password"
                error={errors.new_password?.message}
                maxLength={255}
                required
                {...field}
              />
            )}
          />
          <Controller
            name="new_password_confirmation" 
            control={control}
            render={({ field }) => (
              <InputField
                label="Confirm Password"
                type="password"
                id="new-password-confirmation"
                placeholder="Re-enter your new password"
                error={errors.new_password_confirmation?.message} 
                maxLength={255}
                required
                {...field}
              />
            )}
          />
          <Button
            type="submit"
            label="Update Password"
            size="lg"
            variant="primary"
            className="mt-4 w-full"
          />
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
