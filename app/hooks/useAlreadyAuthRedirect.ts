import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CookieUtils from '@/app/utils/useCookies';

const useAlreadyAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Get token from the cookie
    const userData = CookieUtils.getCookie('userData');

    // If token is found, redirect to the profile page
    if (userData) {
      try {
        // Parse user data from the cookie
        const parsedUserData = JSON.parse(userData);

        // Redirect to the profile page if the user has the required roles
        if (parsedUserData) {
          router.push('/profile');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [router]);
};

export default useAlreadyAuthRedirect;
