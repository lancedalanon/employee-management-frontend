import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import axios, { AxiosError } from 'axios';

// Define the initial state for the registration slice
interface RegistrationState {
    user: object | null;
    companyAdmin: object | null;
    loading: boolean;
    error: string | null;
}

// Initial state structure for the registration slice
const initialState: RegistrationState = {
    user: null,
    companyAdmin: null,
    loading: false,
    error: null,
};

// Async thunk for registering a regular user
export const registerUser = createAsyncThunk<
    { data: { user_id: string; token: string; roles: string[] } },
    object,
    { rejectValue: string }
    >(
    'registration/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL}/v1/register`, userData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'User registration failed');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Async thunk for registering a company admin
export const registerCompanyAdmin = createAsyncThunk<
        { data: { user_id: string; token: string; roles: string[] } },
        object,
        { rejectValue: string }
    >(
    'registration/registerCompanyAdmin',
    async (adminData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL}/v1/register/company-admin`, adminData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Company admin registration failed');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Create registration slice
const registrationSlice = createSlice({
    name: 'registration',
    initialState,
    reducers: {
        // Clear any existing errors in the state
        clearRegistrationError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Handle registerUser cases
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'User registration failed';
            });

        // Handle registerCompanyAdmin cases
        builder
            .addCase(registerCompanyAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerCompanyAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.companyAdmin = action.payload;
            })
            .addCase(registerCompanyAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Company admin registration failed';
            });
    },
});

// Export actions and selectors
export const { clearRegistrationError } = registrationSlice.actions;

// Selector for accessing registration state in components
export const selectRegistrationState = (state: RootState) => state.registration;

// Export the reducer to be included in the store
export default registrationSlice.reducer;
