"use client";
import React from 'react';
import useAuthCheck from '@/app/hooks/useAuthCheck';
import SidebarLayout from '@/components/SidebarLayout';

const DashboardPage: React.FC = () => {
  // Check if the user is authenticated and has the specified roles
  useAuthCheck(['employee', 'intern', 'company_admin']);

  return (
    <SidebarLayout>
      <div className="text-4xl font-bold mb-8">
        <h1>Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-y-4 md:gap-x-4">
        <div className="text-xl bg-blue-500 rounded-lg">
          <h2 className="text-white p-4">
            Current Attendance Streak
          </h2>
          <h3 className="text-5xl text-white text-right p-4">
            0
          </h3>
        </div>
        <div className="text-xl bg-gray-500 rounded-lg">
          <h2 className="text-white p-4">
            Completed Tasks
          </h2>
          <h3 className="text-5xl text-white text-right p-4">
            0
          </h3>
        </div>
        <div className="text-xl bg-green-500 rounded-lg">
          <h2 className="text-white p-4">
            Projects Delivered
          </h2>
          <h3 className="text-5xl text-white text-right p-4">
            0
          </h3>
        </div>
        <div className="text-xl bg-red-500 rounded-lg">
          <h2 className="text-white p-4">
            Leave Days Taken
          </h2>
          <h3 className="text-5xl text-white text-right p-4">
            0
          </h3>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default DashboardPage;
