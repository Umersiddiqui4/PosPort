import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // example

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// For Typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
