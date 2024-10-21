import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import CookieUtils from '@/app/utils/useCookies';
import { logout } from '@/store/authSlice';
import { AppDispatch } from '@/store/store';

const useAuthCheck = (allowedRoles: string[] = []) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    // Get user data from cookie
    const userData = CookieUtils.getCookie('userData');

    // Check if userData is present
    if (!userData) {
      dispatch(logout());
      CookieUtils.deleteCookie('userData', { path: '/' });
      router.push('/');
      return;
    }

    // Parse user data from cookie
    const parsedUserData = JSON.parse(userData);

    // Check if user has any of the allowed roles
    const userHasRole = allowedRoles.some(role => parsedUserData.roles.includes(role));

    // If user does not have any of the allowed roles, log them out and redirect to login page
    if (!userHasRole) {
      dispatch(logout());
      CookieUtils.deleteCookie('userData', { path: '/' });
      router.push('/login');
    }

  }, [dispatch, router, allowedRoles]);
};

export default useAuthCheck;
