"use client";
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { IoIosArrowRoundBack } from "react-icons/io";

// Step-specific interfaces for the registration form
interface PersonalInfo {
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  suffix?: string | null;
  place_of_birth: string;
  date_of_birth: Date;
  gender: string;
  phone_number: string;
}

interface EmploymentInfo {
  employment_type: string;
  shift: string;
  role: string;
}

interface AccountInfo {
  username: string;
  password: string;
  password_confirmation: string;
}

// Consolidated type for the entire registration form
type RegistrationFormData = PersonalInfo & EmploymentInfo & AccountInfo;

// Validation schema for personal information (Step 1)
const personalInfoSchema: yup.ObjectSchema<PersonalInfo> = yup.object().shape({
  first_name: yup
    .string()
    .required('First name is required')
    .max(255)
    .matches(/^[\p{L}\s\-'\.]*$/u, 'Invalid format for first name'),
  middle_name: yup
    .string()
    .nullable()
    .max(255)
    .matches(/^[\p{L}\s\-'\.]*$/u, 'Invalid format for middle name'),
  last_name: yup
    .string()
    .required('Last name is required')
    .max(255)
    .matches(/^[\p{L}\s\-'\.]*$/u, 'Invalid format for last name'),
  suffix: yup
    .string()
    .nullable()
    .max(255)
    .matches(/^[\p{L}\s\-'\.]*$/u, 'Invalid format for suffix'),
  place_of_birth: yup.string().required('Place of birth is required').max(255),
  date_of_birth: yup
    .date()
    .required('Date of birth is required')
    .typeError('Please enter a valid date')
    .max(new Date(), 'Date of birth must be in the past'),
  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(['Male', 'Female'], 'Invalid gender selection'),
  phone_number: yup
    .string()
    .required('Phone number is required')
    .matches(/^09\d{2}-\d{3}-\d{4}$/, 'Phone number must be in the format 09XX-XXX-XXXX')
    .max(13, 'Phone number must be at most 13 characters long'),
});

// Validation schema for employment information (Step 2)
const employmentInfoSchema: yup.ObjectSchema<EmploymentInfo> = yup.object().shape({
  employment_type: yup
    .string()
    .required('Employment type is required')
    .oneOf(['full_time', 'part_time'], 'Invalid employment type'),
  shift: yup
    .string()
    .required('Shift is required')
    .oneOf(
      ['day_shift', 'afternoon_shift', 'evening_shift', 'early_shift', 'late_shift', 'night_shift'],
      'Invalid shift'
    ),
  role: yup.string().required('Role is required').oneOf(['intern', 'employee'], 'Invalid role'),
});

// Validation schema for account information (Step 3)
const accountInfoSchema: yup.ObjectSchema<AccountInfo> = yup.object().shape({
  username: yup.string().required('Username is required').max(255),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(255),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

const Registration: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Extract token from the query parameters
  const [step, setStep] = useState(1); // State to track the current step of the form

  // Get validation schema based on the current step
  const getValidationSchema = (step: number): yup.ObjectSchema<RegistrationFormData> => {
    switch (step) {
      case 1:
        return personalInfoSchema as yup.ObjectSchema<RegistrationFormData>;
      case 2:
        return employmentInfoSchema as yup.ObjectSchema<RegistrationFormData>;
      case 3:
        return accountInfoSchema as yup.ObjectSchema<RegistrationFormData>;
      default:
        return personalInfoSchema as yup.ObjectSchema<RegistrationFormData>;
    }
  };

  // Example form handling using React Hook Form and Yup
  const { register, handleSubmit, formState: { errors }, trigger } = useForm<RegistrationFormData>({
    resolver: yupResolver(getValidationSchema(step)),
    mode: 'onChange',
  });

  // Handle moving to the next step if the current step's form is valid
  const handleNext = async () => {
    const isStepValid = await trigger(); // Validate the current step's form
    if (isStepValid) {
      setStep((prevStep) => prevStep + 1); // Move to the next step
    }
  };

  // Handle going back to the previous step
  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  // Submit handler for the form
  const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
    const submissionData = { ...data, token };

    // Perform final form submission logic here
    console.log('Form data:', submissionData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <main className="w-full max-w-lg bg-white p-8 rounded-md shadow-md">
        <h2 className="text-4xl font-semibold text-center text-gray-700 mb-6">
          {step === 1 ? 'Personal Information' : step === 2 ? 'Employment Information' : 'Account Information'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <>
              {/* Grid layout for the first page */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name Field */}
                <div className="mb-4">
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-600">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    {...register('first_name')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your first name"
                  />
                  {errors.first_name && <p className="text-red-500">{errors.first_name.message}</p>}
                </div>

                {/* Middle Name Field */}
                <div className="mb-4">
                  <label htmlFor="middle_name" className="block text-sm font-medium text-gray-600">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    id="middle_name"
                    {...register('middle_name')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your middle name"
                  />
                  {errors.middle_name && <p className="text-red-500">{errors.middle_name?.message}</p>}
                </div>

                {/* Last Name Field */}
                <div className="mb-4">
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-600">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    {...register('last_name')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your last name"
                  />
                  {errors.last_name && <p className="text-red-500">{errors.last_name.message}</p>}
                </div>

                {/* Suffix Field */}
                <div className="mb-4">
                  <label htmlFor="suffix" className="block text-sm font-medium text-gray-600">
                    Suffix (Optional)
                  </label>
                  <input
                    type="text"
                    id="suffix"
                    {...register('suffix')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="e.g., Jr., Sr., III"
                  />
                  {errors.suffix && <p className="text-red-500">{errors.suffix.message}</p>}
                </div>

                {/* Place of Birth Field */}
                <div className="mb-4">
                  <label htmlFor="place_of_birth" className="block text-sm font-medium text-gray-600">
                    Place of Birth
                  </label>
                  <input
                    type="text"
                    id="place_of_birth"
                    {...register('place_of_birth')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your place of birth"
                  />
                  {errors.place_of_birth && <p className="text-red-500">{errors.place_of_birth.message}</p>}
                </div>

                {/* Date of Birth Field */}
                <div className="mb-4">
                  <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-600">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="date_of_birth"
                    {...register('date_of_birth')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                  />
                  {errors.date_of_birth && <p className="text-red-500">{errors.date_of_birth.message}</p>}
                </div>

                {/* Gender Field */}
                <div className="mb-4">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-600">
                    Gender
                  </label>
                  <select
                    id="gender"
                    {...register('gender')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                  >
                    <option value="">Select your gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
                </div>

                {/* Phone Number Field */}
                <div className="mb-4">
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-600">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone_number"
                    {...register('phone_number')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone_number && <p className="text-red-500">{errors.phone_number.message}</p>}
                </div>
              </div>

              {/* Sign-in instead link */}
              <div className="flex justify-end w-full text-indigo-500 mb-4">
                <Link 
                  href="/auth/login"
                >
                  Already have an account?
                </Link>
              </div>

              <div className="flex justify-between w-full gap-x-2">
                {/* Back Button */}
                <Link
                  href="/auth/register"
                  className="flex flex-row items-center w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:ring-4 focus:ring-gray-200"
                >
                 <IoIosArrowRoundBack className="text-2xl"/> Back to Register Page
                </Link>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-200"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>              
              {/* Employment Type Field */}
              <div className="mb-4">
                <label htmlFor="employment_type" className="block text-sm font-medium text-gray-600">
                  Employment Type
                </label>
                <select
                  id="employment_type"
                  {...register('employment_type')}
                  className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                >
                  <option value="">Select employment type</option>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                </select>
                {errors.employment_type && <p className="text-red-500">{errors.employment_type.message}</p>}
              </div>

              {/* Shift Field */}
              <div className="mb-4">
                <label htmlFor="shift" className="block text-sm font-medium text-gray-600">
                  Shift
                </label>
                <select
                  id="shift"
                  {...register('shift')}
                  className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                >
                  <option value="">Select your shift</option>
                  <option value="day_shift">Day Shift</option>
                  <option value="afternoon_shift">Afternoon Shift</option>
                  <option value="evening_shift">Evening Shift</option>
                  <option value="early_shift">Early Shift</option>
                  <option value="late_shift">Late Shift</option>
                  <option value="night_shift">Night Shift</option>
                </select>
                {errors.shift && <p className="text-red-500">{errors.shift.message}</p>}
              </div>

              {/* Role Field */}
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-600">
                  Role
                </label>
                <select
                  id="role"
                  {...register('role')}
                  className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                >
                  <option value="">Select your role</option>
                  <option value="intern">Intern</option>
                  <option value="employee">Employee</option>
                </select>
                {errors.role && <p className="text-red-500">{errors.role.message}</p>}
              </div>

              {/* Sign-in instead link */}
              <div className="flex justify-end w-full text-indigo-500 mb-4">
                <Link 
                  href="/auth/login"
                >
                  Already have an account?
                </Link>
              </div>

              <div className="flex justify-between w-full">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 mr-2"
                >
                  Back
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-200"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {/* Account Information Fields */}
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-600">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  {...register('username')}
                  className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                  placeholder="Enter your username"
                />
                {errors.username && <p className="text-red-500">{errors.username.message}</p>}
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register('password')}
                  className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                  placeholder="Enter your password"
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-600">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="password_confirmation"
                  {...register('password_confirmation')}
                  className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                  placeholder="Confirm your password"
                />
                {errors.password_confirmation && (
                  <p className="text-red-500">{errors.password_confirmation.message}</p>
                )}
              </div>

              {/* Sign-in instead link */}
              <div className="flex justify-end w-full text-indigo-500 mb-4">
                <Link 
                  href="/auth/login"
                >
                  Already have an account?
                </Link>
              </div>

              <div className="flex justify-between w-full">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 mr-2"
                >
                  Back
                </button>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-200"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      </main>
    </div>
  );
};

export default Registration;
