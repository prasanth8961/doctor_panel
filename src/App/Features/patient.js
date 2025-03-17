import { createSlice } from "@reduxjs/toolkit";

export const patientSlice = createSlice({
    name : 'patient',
    initialState : {
        patients :  [],
    },
    reducers:{
        createPatient : (state , action) => {
            state.patients.push(action.payload);
        },
        updatePatient : (state, action) => {
            state.patients = state.patients.map((patient)=> (patient.id === action.payload.id) 
                        ? {...patient , name : action.payload.name || patient.name, age : action.payload.age || patient.age, contact : action.payload.contact || patient.contact } : patient)
        },
        setPatients : (state, action) => {
            state.patients = action.payload
        },
        removePatient : (state, action) => {
            state.patients = state.patients.filter((patient)=>patient.id !== action.payload.id);
        }
    }
});


export const {createPatient , updatePatient , setPatients, removePatient} = patientSlice.actions; 