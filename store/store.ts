import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, 
  },
});

// TypeScript types for better type support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;