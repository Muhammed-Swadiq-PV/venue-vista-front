import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FormState {
    eventHallName: string;
    phoneNumber: string;
    district: string;
    city: string;
    buildingFloor: string;
    pincode: string;
    ownerIdCardUrl: string | null;
    eventHallLicenseUrl: string | null;
}

const initialState: FormState = {
    eventHallName: '',
    phoneNumber: '',
    district: '',
    city: '',
    buildingFloor: '',
    pincode: '',
    ownerIdCardUrl: null,
    eventHallLicenseUrl: null,
};

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setFormData: (state, action: PayloadAction<FormState>) => {
            return { ...action.payload };
        },
    },
});

export const { setFormData } = formSlice.actions;

export default formSlice.reducer;
