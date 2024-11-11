import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/axios';
import { AxiosError } from 'axios';
import { ProjectTask, PaginatedProjectTaskResponse } from '@/types/projectTaskTypes';
import internal from 'stream';

// Define the initial state for the ProjectTask slice
interface ProjectTaskState {
    tasks: ProjectTask[];
    loading: boolean;
    error: string | null;
}

const initialState: ProjectTaskState = {
    tasks: [],
    loading: false,
    error: null,
};

// Helper function to handle axios errors
const handleError = (error: AxiosError): string => {
    if (error.response) {
        return error.response.data.message || error.response.data || 'Failed to process request';
    }
    return 'An unexpected error occurred';
};

// Async thunk to fetch tasks for a project (following fetchProjects pattern)
export const fetchProjectTasks = createAsyncThunk<PaginatedProjectTaskResponse, { params: Record<string, unknown> }>(
    'projectTask/fetchProjectTasks',
    async ({ params }, { rejectWithValue }) => {
        const { projectId } = params;

        try {
            const response = await axiosInstance.get(`/v1/projects/${projectId}/tasks`, params);
            return response.data.data as PaginatedProjectTaskResponse;
        } catch (error) {
            return rejectWithValue(handleError(error as AxiosError));
        }
    }
);

// Async thunk to create a task for a project
export const createProjectTask = createAsyncThunk<ProjectTask, { projectId: number, taskData: ProjectTask }>(
    'projectTask/createProjectTask',
    async ({ projectId, taskData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/v1/projects/${projectId}/tasks`, taskData);
            return response.data as ProjectTask;
        } catch (error) {
            return rejectWithValue(handleError(error as AxiosError));
        }
    }
);

// Async thunk to update a project task
export const updateProjectTask = createAsyncThunk<ProjectTask, { projectId: number, taskId: number, taskData: ProjectTask }>(
    'projectTask/updateProjectTask',
    async ({ projectId, taskId, taskData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/v1/projects/${projectId}/tasks/${taskId}`, taskData);
            return response.data as ProjectTask;
        } catch (error) {
            return rejectWithValue(handleError(error as AxiosError));
        }
    }
);

// Async thunk to delete a project task
export const deleteProjectTask = createAsyncThunk<void, { projectId: number, taskId: number }>(
    'projectTask/deleteProjectTask',
    async ({ projectId, taskId }, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/v1/projects/${projectId}/tasks/${taskId}`);
        } catch (error) {
            return rejectWithValue(handleError(error as AxiosError));
        }
    }
);

// Create ProjectTask slice
const projectTaskSlice = createSlice({
    name: 'projectTask',
    initialState,
    reducers: {
        clearProjectTaskError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch project tasks
            .addCase(fetchProjectTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload.data;
            })
            .addCase(fetchProjectTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch project tasks';
            })
            // Create project task
            .addCase(createProjectTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProjectTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.push(action.payload);
            })
            .addCase(createProjectTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to create task';
            })
            // Update project task
            .addCase(updateProjectTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProjectTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tasks.findIndex((task) => task.project_task_id === action.payload.project_task_id);
                if (index !== -1) state.tasks[index] = action.payload;
            })
            .addCase(updateProjectTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to update task';
            })
            // Delete project task
            .addCase(deleteProjectTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProjectTask.fulfilled, (state) => {
                state.loading = false;
                // Remove task from the list after deletion
                state.tasks = state.tasks.filter((task) => task.project_task_id !== action.meta.arg.taskId);
            })
            .addCase(deleteProjectTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to delete task';
            });
    },
});

// Export actions and reducer
export const { clearProjectTaskError } = projectTaskSlice.actions;
export default projectTaskSlice.reducer;
