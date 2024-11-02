import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/axios';
import { AxiosError } from 'axios';
import { LeaveRequest, PaginatedLeaveRequestResponse } from '@/types/leaveRequestTypes';

// Define the initial state for the Leave Request slice
interface LeaveRequestState {
    dtr: LeaveRequest[];             
    loading: boolean;       
    error: string | null;   
}

const initialState: LeaveRequestState = {
    dtr: [],
    loading: false,
    error: null,
};

// Create async thunk to fetch DTR data
export const fetchLeaveRequests = createAsyncThunk<PaginatedLeaveRequestResponse, Record<string, unknown>>(
    'dtr/fetchLeaveRequests',
    async (params = {}, { rejectWithValue }) => {
        const { page = 1, perPage = 25, sort = 'dtr_id', order = 'desc', search = '' } = params;

        try {
            const response = await axiosInstance.get('/v1/leave-requests', {
                params: { page, per_page: perPage, sort, order, search },
            });
            // Return the entire response structure instead of just the data
            return response.data.data as PaginatedLeaveRequestResponse;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Failed to fetch leave request data');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Create Leave Request slice
const leaveRequestSlice = createSlice({
    name: 'leaveRequest',
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
            .addCase(fetchLeaveRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.dtr = action.payload.data;
            })
            .addCase(fetchLeaveRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch leave requests data'; 
            });
    },
});

// Export actions and reducer
export const { clearDtrError, clearDtrData } = leaveRequestSlice.actions; 
export default leaveRequestSlice.reducer;
