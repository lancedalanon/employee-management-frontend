import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import CookieUtils from '@/app/utils/useCookies';
import { logout } from '@/store/authSlice';

const useAuthCheck = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const token = CookieUtils.getCookie('token');

    // Check if token is present
    if (!token) {
      dispatch(logout());
      CookieUtils.deleteCookie('token', { path: '/' });
      router.push('/login');
      return;
    }

  }, [dispatch, router]);
};

export default useAuthCheck;