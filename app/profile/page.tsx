"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser } from '@/store/userSlice';
import { AppDispatch } from '@/store/store';
import { logout } from '@/store/authSlice';
import useAuthCheck from '@/app/hooks/useAuthCheck';
import CookieUtils from '@/app/utils/useCookies';
import { useRouter } from 'next/navigation';
import { User } from '@/types/userTypes';
import SidebarLayout from '@/components/SidebarLayout';

const ProfilePage: React.FC = () => {
  // Check if the user is authenticated and has the specified roles
  useAuthCheck(['employee', 'intern', 'company_admin']);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Local state to manage user data, loading, and error states
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const fetchedUser = await dispatch(fetchUser()).unwrap();
        setUser(fetchedUser);
      } catch (err) {
        setError(err as string || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [dispatch]);

  // Logout handler
  const handleLogout = async () => {
    await dispatch(logout());
    CookieUtils.deleteCookie('userData', { path: '/' });
    router.push('/auth/login');
  };

  // Optionally handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <SidebarLayout>
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
    </SidebarLayout>
  );
};

export default ProfilePage;
