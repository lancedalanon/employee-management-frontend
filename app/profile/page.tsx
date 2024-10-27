"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser, setUsername } from '@/store/userSlice';
import { AppDispatch } from '@/store/store';
import useAuthCheck from '@/app/hooks/useAuthCheck';
import { User } from '@/types/userTypes';
import SidebarLayout from '@/components/SidebarLayout';
import PersonalInformationForm from '@/components/profile/PersonalInformationForm';
import Spinner from '@/components/Spinner';
import ErrorAlert from '@/components/profile/ErrorAlert';
import ContactInformationForm from '@/components/profile/ContactInformationForm';
import ApiKeyForm from '@/components/profile/ApiKeyForm';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';

const ProfilePage: React.FC = () => {
  useAuthCheck(['employee', 'intern', 'company_admin']);
  const dispatch = useDispatch<AppDispatch>();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const fetchedUser = await dispatch(fetchUser()).unwrap();
        setUser(fetchedUser);
        dispatch(setUsername(fetchedUser.username));
      } catch (err) {
        setError((err as Error)?.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [dispatch]);

  return (
    <SidebarLayout>
      {loading && <Spinner message="Loading user data..." />}
      {error && <ErrorAlert message={error} />}
      {user && <>
        <PersonalInformationForm user={user} />
        <ContactInformationForm user={user} />
        <ApiKeyForm />
        <ChangePasswordForm />
      </>}
    </SidebarLayout>
  );
};

export default ProfilePage;
