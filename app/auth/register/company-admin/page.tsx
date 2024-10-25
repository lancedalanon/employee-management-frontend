"use client";
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import { IoIosArrowRoundBack } from "react-icons/io";
import { registerCompanyAdmin } from "@/store/registrationSlice";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import CookieUtils from '@/app/utils/useCookies';
import { useRouter } from 'next/navigation';
import useAlreadyAuthRedirect from '@/app/hooks/useAlreadyAuthRedirect';

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
  email: string;
}
interface CompanyInfo {
  company_name: string;
  company_registration_number: string;
  company_tax_id: string;
  company_address: string;
  company_city: string;
  company_state: string;
  company_postal_code: string;
  company_country: string;
  company_phone_number: string;
  company_email: string;
  company_website: string;
  company_industry: string;
  company_founded_at: Date;
}

interface AccountInfo {
  username: string;
  password: string;
  password_confirmation: string;
}

// Consolidated type for the entire registration form
type RegistrationFormData = PersonalInfo & CompanyInfo & AccountInfo;

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
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required')
    .max(255),
});

// Validation schema for company information (Step 2)
const companyInfoSchema: yup.ObjectSchema<CompanyInfo> = yup.object({
  company_name: yup
    .string()
    .required('Company name is required')
    .max(255),
  company_registration_number: yup
    .string()
    .required('Registration number is required')
    .max(50),
  company_tax_id: yup
    .string()
    .required('Tax ID is required')
    .max(50),
  company_address: yup
    .string()
    .required('Company address is required')
    .max(255),
  company_city: yup
    .string()
    .required('City is required')
    .max(100),
  company_state: yup
    .string()
    .required('State is required')
    .max(100),
  company_postal_code: yup
    .string()
    .required('Postal code is required')
    .max(20),
  company_country: yup
    .string()
    .required('Country is required')
    .max(100),
  company_phone_number: yup
    .string()
    .required('Phone number is required')
    .matches(/^09\d{2}-\d{3}-\d{4}$/, 'Phone number must be in the format 09XX-XXX-XXXX')
    .max(13, 'Phone number must be at most 13 characters long'),
  company_email: yup
    .string()
    .email('Invalid email format')
    .required('Company email is required')
    .max(255),
  company_website: yup
    .string()
    .url('Invalid URL format')
    .required('Company website is required')
    .max(255),
  company_industry: yup
    .string()
    .required('Industry is required')
    .max(100),
  company_founded_at: yup
    .date()
    .required('Founded date is required')
    .typeError('Please enter a valid date')
    .max(new Date(), 'Founded date must be in the past'),
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

const CompanyAdminRegistration: React.FC = () => {
  const [step, setStep] = useState(1); // State to track the current step of the form
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Call the hook to check if user is already logged in
  useAlreadyAuthRedirect();

  // Get validation schema based on the current step
  const getValidationSchema = (step: number): yup.ObjectSchema<RegistrationFormData> => {
    switch (step) {
      case 1:
        return personalInfoSchema as yup.ObjectSchema<RegistrationFormData>;
      case 2:
        return companyInfoSchema as yup.ObjectSchema<RegistrationFormData>;
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
    setLoading(true); // Set loading to true when form is being submitted
    const submissionData = { ...data };

    try {
      // Dispatch registerCompanyAdmin action with form data and unwrap the result
      const result = await dispatch(registerCompanyAdmin(submissionData)).unwrap();

      // If successful, extract payload data
      const { user_id, token, roles } = result.data;

      // Save user data in cookies
      const userData = { user_id, token, roles };
      CookieUtils.setCookie('userData', JSON.stringify(userData), { path: '/', secure: true, sameSite: 'Strict' });

      // Redirect to profile page
      router.push('/profile');
    } catch (error) {
      // Handle error if registration fails
      console.error('Registration failed:', error);
    } finally {
      setLoading(false); // Set loading to false after registration finishes
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <main className="w-full max-w-lg bg-white p-8 rounded-md shadow-md">
        <h2 className="text-4xl font-semibold text-center text-gray-700 mb-6">
          {step === 1 ? 'Personal Information' : step === 2 ? 'Company Information' : 'Account Information'}
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

                {/* Email Field */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    {...register('email')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500">{errors.email.message}</p>}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-600">Company Name</label>
                  <input
                    type="text"
                    id="company_name"
                    {...register('company_name')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your company name"
                  />
                  {errors.company_name && <p className="text-red-500">{errors.company_name.message}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="company_registration_number" className="block text-sm font-medium text-gray-600">Company Registration Number</label>
                  <input
                    type="text"
                    id="company_registration_number"
                    {...register('company_registration_number')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your company registration number"
                  />
                  {errors.company_registration_number && <p className="text-red-500">{errors.company_registration_number.message}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="company_tax_id" className="block text-sm font-medium text-gray-600">Company Tax ID</label>
                  <input
                    type="text"
                    id="company_tax_id"
                    {...register('company_tax_id')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your company tax ID"
                  />
                  {errors.company_tax_id && <p className="text-red-500">{errors.company_tax_id.message}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="company_address" className="block text-sm font-medium text-gray-600">Company Address</label>
                  <input
                    type="text"
                    id="company_address"
                    {...register('company_address')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your company address"
                  />
                  {errors.company_address && <p className="text-red-500">{errors.company_address.message}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="company_city" className="block text-sm font-medium text-gray-600">Company City</label>
                  <input
                    type="text"
                    id="company_city"
                    {...register('company_city')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your company city"
                  />
                  {errors.company_city && <p className="text-red-500">{errors.company_city.message}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="company_state" className="block text-sm font-medium text-gray-600">Company State</label>
                  <input
                    type="text"
                    id="company_state"
                    {...register('company_state')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your company state"
                  />
                  {errors.company_state && <p className="text-red-500">{errors.company_state.message}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="company_postal_code" className="block text-sm font-medium text-gray-600">Company Postal Code</label>
                  <input
                    type="text"
                    id="company_postal_code"
                    {...register('company_postal_code')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your company postal code"
                  />
                  {errors.company_postal_code && <p className="text-red-500">{errors.company_postal_code.message}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="company_country" className="block text-sm font-medium text-gray-600">Company Country</label>
                  <input
                    type="text"
                    id="company_country"
                    {...register('company_country')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your company country"
                  />
                  {errors.company_country && <p className="text-red-500">{errors.company_country.message}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="company_phone_number" className="block text-sm font-medium text-gray-600">Company Phone Number</label>
                  <input
                    type="tel"
                    id="company_phone_number"
                    {...register('company_phone_number')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your company phone number"
                  />
                  {errors.company_phone_number && <p className="text-red-500">{errors.company_phone_number.message}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="company_email" className="block text-sm font-medium text-gray-600">Company Email</label>
                  <input
                    type="email"
                    id="company_email"
                    {...register('company_email')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your company email"
                  />
                  {errors.company_email && <p className="text-red-500">{errors.company_email.message}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="company_website" className="block text-sm font-medium text-gray-600">Company Website</label>
                  <input
                    type="url"
                    id="company_website"
                    {...register('company_website')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your company website"
                  />
                  {errors.company_website && <p className="text-red-500">{errors.company_website.message}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="company_industry" className="block text-sm font-medium text-gray-600">Company Industry</label>
                  <input
                    type="text"
                    id="company_industry"
                    {...register('company_industry')}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    placeholder="Enter your company industry"
                  />
                  {errors.company_industry && <p className="text-red-500">{errors.company_industry.message}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="company_founded_at" className="block text-sm font-medium text-gray-600">Company Founding Date</label>
                <input
                  type="date"
                  id="company_founded_at"
                  {...register('company_founded_at')}
                  className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                />
                {errors.company_founded_at && <p className="text-red-500">{errors.company_founded_at.message}</p>}
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

              {/* Buttons */}
              <div className="flex justify-between">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={handleBack}
                  className={`w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 mr-2 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={loading} // Disable the button during form submission
                >
                  Back
                </button>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-200 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={loading} // Disable the button during form submission
                >
                  {loading ? 'Submitting...' : 'Submit'} {/* Show "Submitting..." while loading */}
                </button>
              </div>
            </>
          )}
        </form>
      </main>
    </div>
  );
};

export default CompanyAdminRegistration;
