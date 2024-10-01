"use client";

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { performLogout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { RootState } from '@/store/store';

const ProtectedPage = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(performLogout());
    router.push('/login');
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <h2 className="text-2xl font-bold">Welcome, User</h2>
        <Button className="mt-4" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProtectedPage;
