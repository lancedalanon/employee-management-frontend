"use client";
import React from 'react';
import useAuthCheck from '@/app/hooks/useAuthCheck';
import SidebarLayout from '@/components/SidebarLayout';

const ProfilePage: React.FC = () => {
  // Check if the user is authenticated and has the specified roles
  useAuthCheck(['employee', 'intern', 'company_admin']);

  return (
    <SidebarLayout>
      <div className="text-4xl font-bold mb-8">
        <h1>Projects</h1>
      </div>
    </SidebarLayout>
  );
};

export default ProfilePage;
