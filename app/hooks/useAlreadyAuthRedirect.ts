import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import CookieUtils from '@/app/utils/useCookies';
import { AppDispatch } from '@/store/store';

const useAlreadyAuthRedirect = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    // Get token from the cookie
    const userData = CookieUtils.getCookie('userData');

    // If token is found, redirect to the profile page
    if (userData) {
      // Parse user data from the cookie and check if the user has employee or intern roles
      const parsedUserData = JSON.parse(userData);

      // Redirect to the profile page if the user has employee or intern roles
      if (parsedUserData.roles.includes(['employee', 'intern', 'company_admin'])) {
        router.push('/profile');
      }
    }
  }, [dispatch, router]);
};

export default useAlreadyAuthRedirect;