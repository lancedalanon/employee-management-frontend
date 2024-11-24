import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/axios';
import { RootState } from '@/store/store';
import { AxiosError } from 'axios';
import { User } from '@/types/userTypes';

// Define the initial state for the user slice
interface UserState {
    user: User | null;
    username: string | null;
    loading: boolean;
    error: string | null;
    avatarUrl: string | null;
}

const initialState: UserState = {
    user: null,
    username: null,
    loading: false,
    error: null,
    avatarUrl: null,
};

type PersonalInformationFormValues = {
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    suffix?: string | null;
    place_of_birth: string;
    date_of_birth: string;
    gender: string;
};

type ContactInformationFormValues = {
    username: string;
    email: string;
    recovery_email?: string | null;
    phone_number: string;
    emergency_contact_name?: string | null;
    emergency_contact_number?: string | null;
};

type ApiKeyFormValues = {
    api_key: string;
};

type ChangePasswordFormValues = {
    old_password: string;
    new_password: string;
    new_password_confirmation: string;
};

// Create async thunk to fetch user data
export const fetchUser = createAsyncThunk<User, void>(
    'user/fetchUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/v1/users');
            return response.data.data;
        } catch (error) {
            // Narrowing the error type to AxiosError or generic error
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Failed to fetch user data');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Create async thunk to update personal information data
export const updatePersonalInformation = createAsyncThunk<User, PersonalInformationFormValues>(
    'user/updatePersonalInformation',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/v1/users/personal-information', data);
            return response.data.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Failed to update personal information data');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Create async thunk to update contact information data
export const updateContactInformation = createAsyncThunk<User, ContactInformationFormValues>(
    'user/updateContactInformation',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/v1/users/contact-information', data);
            return response.data.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Failed to update contact information data');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Create async thunk to update api key data
export const updateApiKey = createAsyncThunk<User, ApiKeyFormValues>(
    'user/updateApiKey',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/v1/users/api-key', data);
            return response.data.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Failed to update api key data');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Create async thunk to update password
export const updatePassword = createAsyncThunk<User, ChangePasswordFormValues>(
    'user/updatePassword',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/v1/users/password', data);
            return response.data.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Failed to update password');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Create user slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsername(state, action: PayloadAction<string | null>) {
            state.username = action.payload;
        },
        clearUserError(state) {
            state.error = null;
        },
        clearUserData(state) {
            state.user = null;
            state.username = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.username = action.payload.username;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch user data'; 
            });
    },
});

// Export actions and reducer
export const { clearUserError, setUsername, clearUserData } = userSlice.actions; 
export const selectUserState = (state: RootState) => state.user;
export default userSlice.reducer;
