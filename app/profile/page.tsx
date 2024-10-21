"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, selectUserState } from '@/store/userSlice';
import { logout } from '@/store/authSlice';
import useAuthCheck from '@/app/hooks/useAuthCheck';
import CookieUtils from '@/app/utils/useCookies';
import { useRouter } from 'next/navigation';

const ProfilePage: React.FC = () => {
  // Check if the user is authenticated
  useAuthCheck();

  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(selectUserState);
  const router = useRouter();

  // Fetch user data when the component mounts and if user is not already fetched
  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  // Logout handler
  const handleLogout = async () => {
    await dispatch(logout());
    CookieUtils.deleteCookie('token', { path: '/' });
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-2xl p-8 bg-white shadow-md rounded-lg">
        {loading && <p className="text-gray-600">Loading user data...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {user && (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome, {user.username}!
            </h1>
            <p className="text-gray-600">
              This is a protected page that only authenticated users can access.
            </p>
            <button 
              type="button"
              onClick={handleLogout} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
