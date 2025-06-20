import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { usePost } from "../hooks/usePost";
import { useUpdate } from "../hooks/useUpadate";

export const Patients = () => {
    const [view, setView] = useState("list");
    const { data: patients = [] } = useFetch("patients");
    const { postData, loading } = usePost("patients");
    const { updateData, loading: updating, error } = useUpdate('patients');

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGender, setSelectedGender] = useState("all");

    const [filteredPatients, setFilteredPatients] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [editPatientInfo, setEditPatientInfo] = useState({});


    useEffect(() => {
        setFilteredPatients(patients);
    }, [patients]);


    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        filterPatients(query, selectedGender);
    };


    const handleGenderInputChange = (e) => {
        const gender = e.target.value;
        setSelectedGender(gender);
        filterPatients(searchQuery, gender);
    };

    const filterPatients = (query, gender) => {
        let results = [...patients];

        if (gender !== "all") {
            results = results.filter((p) => p.gender.toLowerCase() === gender);
        }

        if (query.trim()) {
            results = results.filter((p) =>
                p.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        setFilteredPatients(results);
    };



    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const patientData = Object.fromEntries(formData.entries());
        patientData['id'] = new Date().getTime().toString().slice(-4);

        const result = await postData(patientData);
        if (result) {
            console.log("Patient added successfully:", result);
            setFilteredPatients((prev) => [...prev, result]);
        }
        e.target.reset();
    };


    const handleFormUpdate = async (e) => {
        e.preventDefault();
        console.log('form update is processing....')
        const result = await updateData(editPatientInfo.id, editPatientInfo);
        if (result) {
            console.log("Patient updated successfully:", result);

            setFilteredPatients((prev) =>
                [...prev.filter((p) => p.id !== result.id), result]
            );

            setShowEdit(false);
            setEditPatientInfo({});
        }

        e.target.reset();
    };





    const handleEdit = (id) => {
        const patient = patients.find((p) => p.id === id);
        setEditPatientInfo(patient);
        setShowEdit(true);
    };


    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditPatientInfo((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="select-none relative">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 flex items-center justify-between w-full bg-[#B9B4C7] px-10 h-16 shadow-md">
                <div className="flex items-center space-x-10">
                    <div
                        onClick={() => setView("add")}
                        className={`cursor-pointer text-sm lg:text-xl font-semibold text-[#27374D] hover:border-b-2 border-b-cyan-950 ${view === "add" ? "border-b-2" : ""}`}
                    >
                        NEW PATIENT
                    </div>
                    <div
                        onClick={() => setView("list")}
                        className={`cursor-pointer text-sm lg:text-xl font-semibold text-[#27374D] hover:border-b-2 border-b-cyan-950 ${view === "list" ? "border-b-2" : ""}`}
                    >
                        LIST PATIENTS
                    </div>
                </div>

                {view === "list" && (
                    <div className="flex items-center space-x-6">
                        {/* Search */}
                        <div className="flex items-center p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m2.65-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                className="ml-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        {/* Gender filter */}
                        <select
                            value={selectedGender}
                            onChange={handleGenderInputChange}
                            className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded focus:outline-none focus:ring focus:border-blue-300"
                        >
                            <option value="all">All</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="p-4 overflow-y-auto">
                {view === "add" && (
                    <form
                        autoComplete="off"
                        className="max-w-lg bg-white mx-auto mt-10 p-6 rounded-lg shadow-sm"
                        onSubmit={handleFormSubmit}
                    >
                        <h2 className="text-lg font-semibold text-blue-900 mb-4">Add New Patient</h2>

                        {["name", "age", "contact", "city"].map((field) => (
                            <div className="mb-4" key={field}>
                                <label className="block text-gray-700 font-medium mb-2 capitalize">{field}</label>
                                <input
                                    name={field}
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        ))}

                        {/* Gender radio */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Gender</label>
                            <div className="flex space-x-4">
                                {["male", "female"].map((gender) => (
                                    <label key={gender} className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={gender}
                                            required
                                            className="form-radio text-blue-500"
                                        />
                                        <span className="ml-2 capitalize">{gender}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-[#474E68] hover:bg-[#272829] text-white py-2 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-md cursor-pointer ${loading ? "blur-sm opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
                            >
                                {loading ? "creating..." : "create"}
                            </button>
                        </div>
                    </form>
                )}

                {view === "list" && (
                    <div className="mt-4">
                        <div className="grid gap-4 text-md font-bold text-[#0F044C] border-b border-gray-300 pb-2 grid-cols-[1fr_2fr_1fr_2fr_2fr_2fr_auto]">
                            <div>ID</div>
                            <div>NAME</div>
                            <div>AGE</div>
                            <div>GENDER</div>
                            <div>CONTACT</div>
                            <div>CITY</div>
                            <div>ACTION</div>
                        </div>

                        {filteredPatients.map((p) => (
                            <div key={p.id} className="grid gap-4 py-3 items-center border-b border-gray-300 grid-cols-[1fr_2fr_1fr_2fr_2fr_2fr_auto]">
                                <div>{p.id}</div>
                                <div>{p.name}</div>
                                <div>{p.age}</div>
                                <div>{p.gender}</div>
                                <div>{p.contact}</div>
                                <div>{p.city}</div>
                                <div>
                                    <button
                                        onClick={() => handleEdit(p.id)}
                                        className="bg-[#474E68] text-white py-1 px-3 rounded hover:bg-[#272829] transition cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Edit Modal */}
                {showEdit && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
                        <div className="bg-white p-5 rounded-md shadow-lg max-w-lg w-full relative">
                            <div
                                onClick={() => setShowEdit(false)}
                                className="absolute top-2 right-2 text-red-500 font-bold border border-red-300 px-2 rounded-sm cursor-pointer hover:bg-red-100"
                            >
                                X
                            </div>

                            <form onSubmit={handleFormUpdate}>
                                {["name", "age", "contact", "city"].map((field) => (
                                    <div className="mb-4" key={field}>
                                        <label className="block text-gray-700 font-medium mb-2 capitalize">{field}</label>
                                        <input
                                            name={field}
                                            type="text"
                                            value={editPatientInfo[field] || ""}
                                            onChange={handleEditInputChange}
                                            required
                                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                ))}

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className={`bg-[#474E68] hover:bg-[#272829] text-white py-2 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-md cursor-pointer ${loading ? "blur-sm opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
                                    >
                                        {updating ? "Updating..." : "Update"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
