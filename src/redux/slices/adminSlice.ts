import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AdminState {
  email: string;
  token: string;
}

const initialState: AdminState = {
  email: '',
  token: '',
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminDetails: (state, action: PayloadAction<AdminState>) => {
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    clearAdminDetails: (state) => {
      state.email = '';
      state.token = '';
    },
  },
});

export const { setAdminDetails, clearAdminDetails } = adminSlice.actions;

export default adminSlice.reducer;
