"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SelectRegistrationType: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <main className="w-1/2 bg-white p-8 rounded-md shadow-md">
        <h2 className="text-4xl font-semibold text-center text-gray-700 mb-8">
          Select a User Type
        </h2>

        {/* Two Column Layout with Divider */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4 relative">
          
          {/* Employee Section */}
          <div className="text-center">
            <h2 className="text-3xl text-gray-700 mb-4">
              Employee
            </h2>
            <Image 
              src="/assets/images/employee-career.png"
              alt="Image of employee climbing corporate ladder"
              width={1000}
              height={1000}
              className="mx-auto"
            />
            <div className="flex justify-center mt-4">
              <Link href="/auth/register/user">
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-200">
                  Register as Employee
                </button>
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="absolute md:left-1/2 md:h-full bg-gray-300"></div>
          <div className="md:hidden text-center text-2xl">Or</div>

          {/* Company Admin Section */}
          <div className="text-center">
            <h2 className="text-3xl text-gray-700 mb-4">
              Company Admin
            </h2>
            <Image 
              src="/assets/images/company-admin.png"
              alt="Image of company admin managing database"
              width={1000}
              height={1000}
              className="mx-auto"
            />
            <div className="flex justify-center mt-4">
              <Link href="/auth/register/company-admin">
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-200">
                  Register as Company Admin
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Sign-in instead link */}
        <div className="flex justify-center items-center w-full text-indigo-500 mt-8 text-lg">
            <Link 
             href="/auth/login"
            >
             Already have an account?
            </Link>
        </div>
      </main>
    </div>
  );
};

export default SelectRegistrationType;
