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

interface LeaveRequestFormData {
    dtr_absence_date: string;
    dtr_absence_reason: string;
}

// Create async thunk to fetch DTR data
export const fetchLeaveRequests = createAsyncThunk<PaginatedLeaveRequestResponse, Record<string, unknown>>(
    'leaveRequest/fetchLeaveRequests',
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

// Async thunk to store leave request
export const storeLeaveRequest = createAsyncThunk<PaginatedLeaveRequestResponse, LeaveRequestFormData>(
    'leaveRequest/storeLeaveRequest',
    async (formData, { rejectWithValue }) => {
        try {
            // Perform POST request to '/v1/leave-requests' endpoint with FormData
            const response = await axiosInstance.post('/v1/leave-requests', formData);

            // Return the response data structure as PaginatedLeaveRequestResponse
            return response.data as PaginatedLeaveRequestResponse;
        } catch (error) {
            // Handle errors
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Failed to create the leave request');
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
        clearLeaveRequestError(state) {
            state.error = null;
        },
        clearLeaveRequestData(state) {
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
export const { clearLeaveRequestError, clearLeaveRequestData } = leaveRequestSlice.actions; 
export default leaveRequestSlice.reducer;
