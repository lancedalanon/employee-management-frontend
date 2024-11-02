"use client";
import React from 'react';
import useAuthCheck from '@/app/hooks/useAuthCheck';
import SidebarLayout from '@/components/SidebarLayout';

const ProfilePage: React.FC = () => {
  // Check if the user is authenticated and has the specified roles
  useAuthCheck(['employee', 'intern', 'company_admin']);

  return (
    <SidebarLayout>
      <div>Projects</div>
    </SidebarLayout>
  );
};

export default ProfilePage;
