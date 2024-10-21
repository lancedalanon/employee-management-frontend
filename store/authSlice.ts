import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '@/axios';
import { RootState } from '@/store/store';

// Define the state interface
interface AuthState {
  user: null | { email: string };
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Initial state of the auth slice
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Define async thunk for login, using axios without the interceptor
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL}/v1/login`, credentials, 
        {
          withCredentials: true,
        });
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error.response.data); // Handle error response
    }
  }
);

// Define async thunk for logout, also using axios without the interceptor
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.post(`${process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL}/v1/logout`, 
      {
        withCredentials: true,
      });
    return true;
  } catch (error: any) {
    return rejectWithValue(error.response.data); // Handle error response
  }
});

// Create the authSlice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user; // Assuming the backend returns user data
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

// Export the state selectors
export const selectAuthState = (state: RootState) => state.auth;

// Export the reducer to add it to the store
export default authSlice.reducer;
