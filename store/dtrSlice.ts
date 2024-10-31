import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/axios';
import { AxiosError } from 'axios';
import { Dtr, PaginatedDtrResponse } from '@/types/dtrTypes';

// Define the initial state for the DTR slice
interface DtrState {
    dtr: Dtr[];             
    loading: boolean;       
    error: string | null;   
}

const initialState: DtrState = {
    dtr: [],
    loading: false,
    error: null,
};

// Create async thunk to fetch DTR data
export const fetchDtrs = createAsyncThunk<PaginatedDtrResponse, Record<string, unknown>>(
    'dtr/fetchDtrs',
    async (params = {}, { rejectWithValue }) => {
        const { page = 1, perPage = 25, sort = 'dtr_id', order = 'desc', search = '' } = params;

        try {
            const response = await axiosInstance.get('/v1/dtrs', {
                params: { page, per_page: perPage, sort, order, search },
            });
            // Return the entire response structure instead of just the data
            return response.data.data as PaginatedDtrResponse;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Failed to fetch DTR data');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Async thunk to store DTR time-in
export const storeTimeIn = createAsyncThunk<PaginatedDtrResponse, void>(
    'dtr/storeTimeIn',
    async (_, { rejectWithValue }) => {
        try {
            // Perform POST request to '/v1/dtrs/time-in' endpoint
            const response = await axiosInstance.post('/v1/dtrs/time-in');

            // Return the response data structure as PaginatedDtrResponse
            return response.data as PaginatedDtrResponse;
        } catch (error) {
            // Handle errors
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Failed to store DTR time-in');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Async thunk to store DTR time-out
export const storeTimeOut = createAsyncThunk<void, void>(
    'dtr/storeTimeOut',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/v1/dtrs/time-out');
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Failed to store DTR time-out');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Async thunk to store DTR break
export const storeBreak = createAsyncThunk<void, void>(
    'dtr/storeBreak',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/v1/dtrs/break');
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Failed to store DTR break');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Async thunk to store DTR resume
export const storeResume = createAsyncThunk<void, void>(
    'dtr/storeResume',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/v1/dtrs/resume');
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Failed to store DTR resume');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Create DTR slice
const dtrSlice = createSlice({
    name: 'dtr',
    initialState,
    reducers: {
        clearDtrError(state) {
            state.error = null;
        },
        clearDtrData(state) {
            state.dtr = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDtrs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDtrs.fulfilled, (state, action) => {
                state.loading = false;
                state.dtr = action.payload.data;
            })
            .addCase(fetchDtrs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch DTR data'; 
            });
    },
});

// Export actions and reducer
export const { clearDtrError, clearDtrData } = dtrSlice.actions; 
export default dtrSlice.reducer;
