"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { performLogout } from '@/store/slices/authSlice';
import Cookies from 'js-cookie';

const ProtectedPage = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    useEffect(() => {
        const token = Cookies.get('token');

        // Check if the cookie has expired
        if (!token) {
            dispatch(performLogout());
            window.location.href = '/login';
        }
    }, [dispatch]);

    // Function to handle logout
    const handleLogout = () => {
        dispatch(performLogout());
        window.location.href = '/login'; // Redirect after logout
    };

    return (
        <div>
            <h1>Protected Page</h1>
            {isAuthenticated ? (
                <>
                  <p>You are logged in.</p>
                  <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                  <p>You are not authenticated.</p>
                  <button onClick={handleLogout}>Logout</button>
                </>
            )}
        </div>
    );
};

export default ProtectedPage;
