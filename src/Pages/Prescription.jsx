import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { MdShoppingCart } from "react-icons/md";
import { getDatabase, ref, set } from 'firebase/database'
import { app } from "../Firebase/firebase_config";
import { useRef } from "react";


export const Prescription = () => {
    const [selectedMedications, setSelectedMedications] = useState([]);
    const [medicationName, setMedicationName] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [quantityInput, setQuantityInput] = useState("");
    const { data: medicationsList, error, loading } = useFetch("medications");
    const [showPop, setShowPop] = useState(false);
    const [mobileNumber, setMobileNumber] = useState('');
    const [sending, setSending] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const addButtonRef = useRef(null);


    const db = getDatabase(app);

    const handleAddMedication = (medicationName) => {
        if (!quantityInput || !medicationName) return;
        setSelectedMedications((prev) => {
            const existingMed = prev.find((med) => med.name === medicationName);
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


    const generateOTP = async () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    const handleOTPSend = async () => {
        if (!mobileNumber || isNaN(mobileNumber)) return;
        setSending(true);
        const OTP = await generateOTP()
        try {
            const res = await fetch("https://sms-service-ib2lcr7v1-prasanth8961s-projects.vercel.app/api/send-sms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ to: '+91' + mobileNumber, message: `Your OTP is - ${OTP}` }),
            });

            const data = await res.json();
            if (data.success) {
                const medsObject = selectedMedications.reduce((acc, item) => {
                    acc[item.name] = item.quantity;
                    return acc;
                }, {});
                medsObject.isDispensed = "NO";
                await set(ref(db, 'prescriptions/' + OTP), medsObject);
            }
            setSelectedMedications([])
            setShowPop(false);
            setMobileNumber('')
        } catch (e) {
            console.log(e);
        }
        setSending(false);
    }

    const handleRemoveMedication = (name) => {
        setSelectedMedications(selectedMedications.filter((selected) => selected.name !== name))
    };

    const handleMenuChange = (menuItem) => {
        setQuantityInput('');
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
                        ref={dropdownRef}
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
                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                                <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414 6.707 12.707a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
                            </svg>
                        ) : (
                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                                <path d="M7.293 7.293a1 1 0 011.414 0L12 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        )}
                    </div>
                </div>
                <div className="w-[6%] px-4 py-2 border border-white rounded-md flex items-center justify-center">
                    X
                </div>

                <input
                    ref={inputRef}
                    type="number"
                    value={quantityInput}
                    onChange={handleQuantityInput}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleAddMedication(medicationName);
                            addButtonRef.current?.focus(); // move focus to button
                        } else if (e.key === "ArrowRight") {
                            addButtonRef.current?.focus();
                        } else if (e.key === "ArrowLeft") {
                            dropdownRef.current?.focus();
                        }
                    }}
                    className="rounded border-2 border-gray-200 py-2 px-3 text-base text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-950"
                    placeholder="Enter quantity"
                />

                <div
                    ref={addButtonRef}
                    tabIndex={0} 
                    className="w-[10%] flex items-center justify-center border border-[#474E68] px-4 py-2 bg-[#474E68] hover:bg-[#272829] cursor-pointer text-white font-bold rounded-lg focus:outline-none"
                    onClick={() => handleAddMedication(medicationName)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleAddMedication(medicationName);
                        } else if (e.key === "ArrowLeft") {
                            inputRef.current?.focus();
                        }
                    }}
                >
                    ADD
                </div>
            </div>

            {/* <div className="flex items-center justify-between gap-2">
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
                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                                <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414 6.707 12.707a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
                            </svg>
                        ) : (
                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                                <path d="M7.293 7.293a1 1 0 011.414 0L12 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        )}
                    </div>
                </div>

                <div className="w-[6%] px-4 py-2 border border-white rounded-md flex items-center justify-center ">
                    X
                </div>

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

            </div> */}

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
                        <button onClick={() => setShowPop(true)} className="border border-[#474E68] px-4 py-2 bg-[#474E68] hover:bg-[#272829] cursor-pointer text-white font-bold rounded-lg">
                            Send OTP
                        </button>
                    </div>
                </div>
            )}

            {
                showPop && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50 ">
                        <div className="bg-white py-6 px-10 pb-10 rounded-lg shadow-lg relative">
                            <input type="text" onChange={(e) => setMobileNumber(Number(e.target.value.trim()))} name="phoneNumber" id="number" placeholder="Enter phone number" className="border-2 border-gray-300 py-2 px-4 mt-2 rounded-md" />
                            <button
                                onClick={handleOTPSend}
                                disabled={sending}
                                className={`mt-4 ml-4 px-6 py-2 rounded text-white transition duration-200 
    ${sending
                                        ? 'bg-blue-900 cursor-not-allowed backdrop-blur-sm opacity-70'
                                        : 'bg-blue-900 hover:bg-blue-950 hover:backdrop-blur-sm hover:opacity-90 hover:shadow-md'}`}
                            >
                                {sending ? 'Sending...' : 'Send'}
                            </button>

                            <div
                                onClick={() => setShowPop(false)}
                                className=" absolute top-0 right-0 bg-red-400 px-2 text-white rounded-bl-md rounded-tr-md font-semibold hover:bg-red-500 cursor-pointer"
                            >
                                X
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};
