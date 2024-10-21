import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import CookieUtils from '@/app/utils/useCookies';

const useAuthRedirect = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const token = CookieUtils.getCookie('token');

    // If token is found, redirect to the profile page
    if (token) {
      router.push('/profile');
    }
  }, [dispatch, router]);
};

export default useAuthRedirect;