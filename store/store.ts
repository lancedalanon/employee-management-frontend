import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {},
});

// Export the type of the root state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
