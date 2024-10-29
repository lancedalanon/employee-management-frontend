import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import registrationReducer from './registrationSlice';
import dtrReducer from './dtrSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    registration: registrationReducer,
    dtr: dtrReducer,
  },
});

// Export the type of the root state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
