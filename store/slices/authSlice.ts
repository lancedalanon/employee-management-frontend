import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import Cookies from 'js-cookie';

interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: AuthState = {
    isAuthenticated: false,
    loading: false,
    error: null,
};

// Create the auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state) {
            state.isAuthenticated = true;
            state.loading = false;
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
    },
});

// Export actions
export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// Async action for login
export const loginUser = (credentials: { username: string; password: string }) => async (dispatch: any) => {
    dispatch(loginStart());
    try {
        const response = await axiosInstance.post('/v1/login', credentials);
        // Set the token in cookies
        Cookies.set('token', response.data.data.token);
        dispatch(loginSuccess());
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
        dispatch(loginFailure(errorMessage));
    }
};

// Create a logout function
export const performLogout = () => async (dispatch: any) => {
    await axiosInstance.post('/v1/logout');
    Cookies.remove('token'); // Remove token from cookies
    dispatch(logout());
};

// Export reducer
export default authSlice.reducer;