"use client";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { login, selectAuthState } from '@/store/authSlice';
import CookieUtils from '@/app/utils/useCookies';
import { useRouter } from 'next/navigation';
import useAlreadyAuthRedirect from '@/app/hooks/useAlreadyAuthRedirect';

interface LoginFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(selectAuthState);
  const router = useRouter();

  // Call the hook to check if user is already logged in
  useAlreadyAuthRedirect();

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Dispatch the login action from authSlice
    const result = await dispatch(login(formData));
    
    // Check if login was successful
    if (login.fulfilled.match(result)) {
      // Set the token in cookies
      const { user_id, token, roles } = result.payload.data;

      // Create a user data object
      const userData = {
        user_id,
        token,
        roles,
      };

      CookieUtils.setCookie('userData', JSON.stringify(userData), { path: '/', secure: true, sameSite: 'Strict' });

      // Redirect to protected page after successful login
      router.push('/dashboard');
    } else {
      console.log('Login failed:', result.payload);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-md shadow-md">
        <h2 className="text-4xl font-semibold text-center text-gray-700 mb-6">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
              placeholder="Enter your username"
              maxLength={255}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
              placeholder="Enter your password"
              maxLength={255}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-200 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="text-red-500 mt-4">{typeof error === 'string' ? error : JSON.stringify(error)}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
