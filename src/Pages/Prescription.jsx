import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { MdShoppingCart } from "react-icons/md";

export const Prescription = () => {
    const [selectedMedications, setSelectedMedications] = useState([]);
    const [medicationName, setMedicationName] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [quantityInput, setQuantityInput] = useState("");
    const { data: medicationsList, error, loading } = useFetch("medications");

    const handleAddMedication = (medicationName) => {
        if (!quantityInput || !medicationName) return;
        setSelectedMedications((prev) => {
            const existingMed = prev.find((med) => med.name === medicationName);
            console.log(existingMed);
            if (existingMed) {
                return prev.map((med) =>
                    med.name === medicationName ? { ...med, quantity: med.quantity + quantityInput } : med
                );
            } else {
                return [...prev, { name: medicationName, quantity: quantityInput }];
            }
        });
        setQuantityInput("");
    };

    const handleRemoveMedication = (name) => {
        setSelectedMedications(selectedMedications.filter((selected) => selected.name !== name))
    };

    const handleMenuChange = (menuItem) => {
        setQuantityInput(null);
        setMedicationName(menuItem);
    }

    const handleQuantityInput = (e) => {
        const value = Number(e.target.value.trim());
        if (value > 0) {
            setQuantityInput(value);
        } else {
            setQuantityInput("");
        }
    };

    return (
        <div className="p-6 select-none">
            <h2 className="text-2xl font-semibold text-[#0A043C]">Add Prescriptions</h2>

            <div className="flex items-center justify-between gap-2">
                <div className="relative w-[60%] mt-2">
                    <select
                        onFocus={() => setIsDropdownOpen(true)}
                        onBlur={() => setIsDropdownOpen(false)}
                        className="block w-full px-4 py-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 appearance-none cursor-pointer"
                        onChange={(e) => {
                            const selected = medicationsList.find((med) => med.value === e.target.value);
                            if (selected) handleMenuChange(selected.label);
                        }}
                        defaultValue=""
                    >
                        <option value="" disabled>Select a medication</option>
                        {medicationsList.map((med) => (
                            <option key={med.id} value={med.value}>
                                {med.label}
                            </option>
                        ))}
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-700">
                        {isDropdownOpen ? (
                            // Up arrow icon
                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                                <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414 6.707 12.707a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
                            </svg>
                        ) : (
                            // Down arrow icon
                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                                <path d="M7.293 7.293a1 1 0 011.414 0L12 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        )}
                    </div>
                </div>

                <div className="w-[6%] px-4 py-2 border border-white rounded-md flex items-center justify-center ">
                    X
                </div>

                {/* <div className="w-[20%] px-4 py-3 border border-gray-300 rounded-md  bg-white cursor-pointer flex items-center justify-center"> */}
                <input
                    type="number"
                    value={quantityInput}
                    onChange={handleQuantityInput}
                    onKeyDown={(e) => e.key === "Enter" && handleAddMedication(medicationName)}
                    className="rounded border-2 border-gray-200 py-2 px-3 text-base text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-950"
                    placeholder="Enter quantity"
                />


                <div className="w-[10%] flex items-center justify-center border border-[#474E68] px-4 py-2 bg-[#474E68] hover:bg-[#272829] cursor-pointer text-white font-bold rounded-lg" 
                onClick={() => handleAddMedication(medicationName)}>
                    ADD
                </div>

            </div>

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
                                    className="text-red-600 cursor-pointer absolute top-0 right-0 border border-red-300 bg-red-200 w-4 h-4 flex items-center justify-center rounded-tr-sm rounded-bl-sm"
                                    onClick={() => handleRemoveMedication(med.name)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className=" absolute right-2 top-2 flex gap-4 items-center">
                        <div className="h-8 w-8flex items-center justify-center relative">
                            <MdShoppingCart size={35} color="#1e5f74" />
                            <span className="text-blue-950 bg-blue-100 w-4 h-4 rounded-full absolute -top-1 right-1 flex items-center justify-center font-bold text-sm p-1">{selectedMedications.length}</span>
                        </div>
                        <button className="border border-[#474E68] px-4 py-2 bg-[#474E68] hover:bg-[#272829] cursor-pointer text-white font-bold rounded-lg">
                            Send OTP
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
