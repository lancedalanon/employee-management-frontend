import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/axios';
import { RootState } from '@/store/store';
import { AxiosError } from 'axios';
import { User } from '@/types/userTypes';

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
            // Narrowing the error type to AxiosError or generic error
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Failed to fetch user data');
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
