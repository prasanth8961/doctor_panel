import { configureStore } from "@reduxjs/toolkit";
import { patientSlice } from "./Features/patient";
import { prescriptionSlice } from "./Features/prescription";
import { medicationSlice } from "./Features/medication";

export const store = configureStore({
    reducer : {
        patient : patientSlice.reducer,
        prescription : prescriptionSlice.reducer,
        medication : medicationSlice.reducer,
    }
});