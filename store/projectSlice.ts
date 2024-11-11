import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/axios';
import { AxiosError } from 'axios';
import { Project, PaginatedProjectResponse } from '@/types/projectTypes';

// Define the initial state for the Project slice
interface ProjectState {
    projects: Project[];
    loading: boolean;
    error: string | null;
}

const initialState: ProjectState = {
    projects: [],
    loading: false,
    error: null,
};

// Async thunk to fetch projects
export const fetchProjects = createAsyncThunk<PaginatedProjectResponse, Record<string, unknown>>(
    'project/fetchProjects',
    async (params = {}, { rejectWithValue }) => {
        const { page = 1, perPage = 25, sort = 'project_id', order = 'desc', search = '' } = params;

        try {
            const response = await axiosInstance.get('/v1/projects', {
                params: { page, per_page: perPage, sort, order, search },
            });
            return response.data.data as PaginatedProjectResponse;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Failed to fetch projects');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Async thunk to create a project
export const createProject = createAsyncThunk<Project, Project>(
    'project/createProject',
    async (projectData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/v1/projects', projectData);
            return response.data as Project;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Failed to create project');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Async thunk to update a project
export const updateProject = createAsyncThunk<Project, Project>(
    'project/updateProject',
    async (projectData, { rejectWithValue }) => {
        try {
            const { project_id, ...updateData } = projectData;
            const response = await axiosInstance.put(`/v1/projects/${project_id}`, updateData);
            return response.data as Project;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Failed to update project');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Async thunk to delete a project
export const deleteProject = createAsyncThunk<void, number>(
    'project/deleteProject',
    async (projectId, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/v1/projects/${projectId}`);
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data || 'Failed to delete project');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Create Project slice
const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        clearProjectError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch projects
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.data;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch projects';
            })
            // Create project
            .addCase(createProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects.push(action.payload);
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to create project';
            })
            // Update project
            .addCase(updateProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.projects.findIndex(
                    (project) => project.project_id === action.payload.project_id
                );
                if (index !== -1) state.projects[index] = action.payload;
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to update project';
            })
            // Delete project
            .addCase(deleteProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = state.projects.filter(
                    (project) => project.project_id !== action.meta.arg
                );
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to delete project';
            });
    },
});

// Export actions and reducer
export const { clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;
