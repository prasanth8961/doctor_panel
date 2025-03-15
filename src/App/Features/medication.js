import { createSlice } from "@reduxjs/toolkit";



export const medicationSlice = createSlice({
    name : 'medication',
    initialState : {
        medications : [],
    },
    reducers : {
        addMedication : (state , action )=>{
            state.medications.push(action.payload);
        },
        updateMedication : (state, action)=>{
            state.medications = state.medications.map(
                (medicine) => (medicine.id === action.payload.id)
                ? {
                    ...medicine,
                    name : action.payload.name || medicine.name, 
                    quantity : action.payload.quantity || medicine.quantity}
                : medicine
            );
        },
        removeMedication : (state , action) => {
            state.medications = state.medications.filter(
                (medicine) => medicine.id !== action.payload.id
            );
        }
    }
});

export const {addMedication, updateMedication, removeMedication} = medicationSlice.actions;
