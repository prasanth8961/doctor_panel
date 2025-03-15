import { createSlice } from "@reduxjs/toolkit";


export const prescriptionSlice = createSlice({
    name : 'prescription',
    initialState : {
        prescriptions : []
    },
    reducers : {
        createPrescription : (state , action) => {
            state.prescriptions.push(action.payload);
        },
        updatePrescription : (state, action) => {
            state.prescriptions.map(
                (prescription) => (prescription.id === action.payload.id) 
                ? {...prescription, quantity : action.payload.quantity || prescription.quantity}
                : prescription
            )
        },
        removePrescription : (state , action) => {
            state.prescriptions = state.prescriptions.filter((prescription)=> prescription.id !== action.payload.id);
        }
    }
});

export const {createPrescription , updatePrescription , removePrescription} = prescriptionSlice.actions;
