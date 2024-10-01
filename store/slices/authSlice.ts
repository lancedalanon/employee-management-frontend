import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  full_name: string | null;
  roles: string[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  full_name: null,
  roles: [],
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ token: string; full_name: string; roles: string[] }>) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.full_name = action.payload.full_name;
      state.roles = action.payload.roles;
      state.loading = false;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.full_name = null;
      state.roles = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export const loginUser = (credentials: { username: string; password: string }) => async (dispatch: any) => {
  dispatch(loginStart());
  try {
    const response = await axiosInstance.post('/v1/login', credentials);
    const { token, full_name, roles } = response.data; // Extract token, name, and roles from the response
    dispatch(loginSuccess({ token, full_name, roles }));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
    dispatch(loginFailure(errorMessage));
  }
};

export const performLogout = () => async (dispatch: any) => {
  await axiosInstance.post('/v1/logout');
  dispatch(logout());
};

export default authSlice.reducer;
