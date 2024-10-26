"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser, setUsername } from '@/store/userSlice';
import { AppDispatch } from '@/store/store';
import useAuthCheck from '@/app/hooks/useAuthCheck';
import { User } from '@/types/userTypes';
import SidebarLayout from '@/components/SidebarLayout';

const ProfilePage: React.FC = () => {
  // Check if the user is authenticated and has the specified roles
  useAuthCheck(['employee', 'intern', 'company_admin']);

  const dispatch = useDispatch<AppDispatch>();

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
        dispatch(setUsername(fetchedUser.username));
      } catch (err) {
        setError(err as string || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [dispatch]);

  return (
    <SidebarLayout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-2xl p-8 shadow-lg rounded-lg bg-surface border">
          {loading && <p className="text-onsurface">Loading user data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {user && (
            <>
              <h1 className="text-3xl font-bold text-onsurface mb-4">
                Welcome, {user.username}!
              </h1>
              <p className="text-onsurface">
                This is a protected page that only authenticated users can access.
              </p>
            </>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ProfilePage;
