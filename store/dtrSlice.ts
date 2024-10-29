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
