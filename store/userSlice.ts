import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/axios';
import { RootState } from '@/store/store';

// Define a User type (adjust fields according to your API response)
interface User {
    first_name: string;
    middle_name: string | null;
    last_name: string;
    suffix: string | null;
    place_of_birth: string;
    date_of_birth: string;
    gender: string;
    username: string;
    email: string;
    recovery_email: string | null;
    phone_number: string;
    emergency_contact_name: string | null;
    emergency_contact_number: string | null;
    full_name: string;
}

// Define the initial state for the user slice
interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
};

// Create async thunk to fetch user data
export const fetchUser = createAsyncThunk<User, void>(
    'user/fetchUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/v1/users');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch user data');
        }
    }
);

// Create user slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserError(state) {
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
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch user data'; 
            });
    },
});

// Export actions and reducer
export const { clearUserError } = userSlice.actions;
export const selectUserState = (state: RootState) => state.user;
export default userSlice.reducer;
