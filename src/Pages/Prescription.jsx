import { useState } from "react";
import { useFetch } from "../hooks/useFetch";

export const Prescription = () => {
    const [selectedMedications, setSelectedMedications] = useState([]);
    const [medicationName, setMedicationName] = useState(null);
    const [quantityInput, setQuantityInput] = useState(1);
    // const medicationsList = [
    //     { id: 1, name: "Acetaminophen", value: "acetaminophen" },
    //     { id: 2, name: "Ibuprofen", value: "ibuprofen" },
    //     { id: 3, name: "Naproxen", value: "naproxen" },
    //     { id: 4, name: "Codeine", value: "codeine" },
    //     { id: 5, name: "Tramadol", value: "tramadol" }
    // ];
    const {data: medicationsList , error , loading } =  useFetch("medications");
    console.log(error)
    console.log(medicationsList)
    const handleAddMedication = (medicationName) => {
        setSelectedMedications((prev) => {
            const existingMed = prev.find((med) => med.name === medicationName);
            if (existingMed) {
                return prev.map((med) =>
                    med.name === medicationName ? { ...med, quantity: med.quantity + 1 } : med
                );
            } else {
                return [...prev, { name: medicationName, quantity: quantityInput }];
            }
        });
        setQuantityInput(1);
    };

    const handleRemoveMedication = (name) => {
        setSelectedMedications(selectedMedications.filter((selected) => selected.name !== name))
    };

    return (
        <div className="p-6 select-none">
            <h2 className="text-2xl font-semibold text-[#0A043C]">Add Prescriptions</h2>

            <div className="flex items-center justify-between">
                <div className="relative w-[60%] mt-2">
                    <select
                        className="block w-full px-4 py-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 appearance-none"
                    >
                        <option value="" disabled selected>Select a medication</option>
                        {medicationsList.map((med) => (
                            <option onClick={() => setMedicationName(med.label)} key={med.id} value={med.value}>{med.label}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-700">
                        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                            <path d="M7.293 14.707a1 1 0 001.414 0L12 11.414l3.293 3.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 000 1.414z" />
                        </svg>
                    </div>
                </div>

                <div className="w-[6%] px-4 py-2 border border-white rounded-md flex items-center justify-center ">
                    X
                </div>

                {/* <div className="w-[20%] px-4 py-3 border border-gray-300 rounded-md  bg-white cursor-pointer flex items-center justify-center"> */}
                <input onChange={(e) => setQuantityInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddMedication(medicationName)} className="w-[20%] px-4 py-2 border border-gray-300 rounded-md  bg-white flex items-center justify-center font-bold text-xl focus:outline-none" value={quantityInput} type="text" name="quantity" id="quantity" placeholder="1" />

                <div className="w-[10%] flex items-center justify-center border border-[#474E68] px-4 py-2 bg-[#474E68] hover:bg-[#272829] cursor-pointer text-white font-bold rounded-lg" onClick={() => handleAddMedication(medicationName)}>
                    ADD
                </div>

            </div>


            {/* Display Selected Medications */}
            {selectedMedications.length > 0 && (
                <div className="p-4 mt-10 border border-gray-400 rounded-md bg-gray-50 relative">
                    <h3 className="text-lg font-semibold text-[#0A043C]">Selected Medications</h3>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {selectedMedications.map((med, idx) => (
                            <div
                                key={idx}
                                className="px-2 py-2 bg-white text-black border-gray-300 border-1 rounded-md flex items-center gap-4 relative"
                            >
                                {med.name}
                                <span className="ml-2 mr-5 text-blue-900 font-bold bg-[#caccd1] rounded-sm px-3 py-1 text-xs">
                                    {med.quantity}
                                </span>
                                <button
                                    className="text-red-600 cursor-pointer absolute -top-1 right-1"
                                    onClick={() => handleRemoveMedication(med.name)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="border border-[#474E68] px-4 py-2 absolute right-2 top-2 bg-[#474E68] hover:bg-[#272829] cursor-pointer text-white font-bold rounded-lg">
                        Send OTP
                    </button>
                </div>
            )}
        </div>
    );
};
