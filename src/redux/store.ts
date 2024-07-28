import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import formReducer, { FormState } from './slices/formSlice';

const store = configureStore({
  reducer: {
    admin: adminReducer,
    form: formReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
