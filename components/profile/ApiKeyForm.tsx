"use client";
import React from 'react';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { updateApiKey } from '@/store/userSlice';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type ApiKeyFormValues = {
  api_key: string;
};

// Validation schema
const schema = yup.object().shape({
  api_key: yup
    .string()
    .required('API Key is required')
    .min(32, 'API Key must be at least 32 characters')
    .max(255, 'API Key cannot exceed 255 characters'),
});

const ApiKeyForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { control, handleSubmit, formState: { errors }, reset } = useForm<ApiKeyFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      api_key: '',
    },
  });

  const onSubmit = async (data: ApiKeyFormValues) => {
    try {
      await dispatch(updateApiKey(data)).unwrap();
      reset();
    } catch (error) {
      console.error("Error updating API Key:", error);
    }
  };

  return (
    <div className="w-full p-4 shadow-lg rounded-lg bg-surface border mb-8">
      <h1 className="text-4xl font-bold text-center">API Key</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 gap-4">
          <Controller
            name="api_key"
            control={control}
            render={({ field }) => (
              <InputField
                label="API Key"
                type="password"
                id="api_key"
                placeholder="Enter your API Key"
                error={errors.api_key?.message}
                maxLength={255}
                required
                {...field}
              />
            )}
          />
          <Button
            type="submit"
            label="Update API Key"
            size="lg"
            variant="primary"
            className="mt-4 w-full"
          />
        </div>
      </form>
    </div>
  );
};

export default ApiKeyForm;
