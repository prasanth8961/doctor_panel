import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { usePost } from "../hooks/usePost";
import { useDispatch, useSelector } from "react-redux";
import { setPatients } from '../App/Features/patient'

export const Patients = () => {

    const [view, setView] = useState("list");
    const { data: patients } = useFetch("patients");
    const { postData, loading } = usePost("patients");
    const [selectedGender, setSelectedGender] = useState("all")
    const [searchQuery, setSearchQuery] = useState("");

    const [filteredPatients, setFilteredPatients] = useState([]);

    useEffect(() => {
        setFilteredPatients(patients);
    }, [patients])

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

    const handleSearchInputChange = (e) => {
        const searchQuery = e.target.value;
        setSearchQuery(searchQuery);
        const filteredData = patients.filter((patient) =>
            patient.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPatients(filteredData)
    }

    const handleGenderInputChange = (e) => {
        const gender = e.target.value;
        const filteredData = patients.filter((patient) =>
            patient.gender === gender.toLowerCase() 
        );
        setFilteredPatients(filteredData);
    }
    


    return (
        <div className="select-none">
            <nav className="sticky top-0 z-50 flex items-center justify-between w-full bg-[#B9B4C7] px-10 h-16 shadow-md">
                <div className="flex items-center md:space-x-10">
                    <div onClick={() => setView("add")} className={` ${view === 'add' ? "border-b-2" : ""} cursor-pointer  text-sm lg:text-xl font-semibold text-[#27374D] hover:border-b-2 border-b-cyan-950`}>
                        NEW PATIENT
                    </div>
                    <div onClick={() => setView("list")} className={` ${view === 'list' ? "border-b-2" : ""} cursor-pointer  text-sm lg:text-xl font-semibold text-[#27374D] hover:border-b-2 border-b-cyan-95`}>
                        SHOW PATIENTS
                    </div>
                </div>


                {
                    view === "list" && (
                        <div className="flex items-center space-x-3 lg:space-x-6">

                            <div className="flex items-center p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m2.65-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearchInputChange(e)}
                                    className="ml-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                                />
                            </div>


                            <div className="relative inline-block w-35 lg:48">
                                <select
                                    name="gender"
                                    id="all"
                                    value={selectedGender}
                                    onChange={(e) => handleGenderInputChange(e)}
                                    className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-10 rounded leading-tight focus:outline-none focus:ring focus:border-blue-300 appearance-none"
                                >
                                    <option value="all">All</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                                        <path d="M7.293 14.707a1 1 0 001.414 0L12 11.414l3.293 3.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 000 1.414z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )
                }
            </nav>

            <main className="p-5 scroll-auto overflow-y-scroll pt-[calc(20px)]">
                {
                    view === "add" && (
                        <>
                            <div className="p-4  border-1 border-gray-500 rounded-md flex flex-col items-start justify-center">
                                <h3 className="font-semibold text-blue-900">FILL NEW PATIENT INFORMATION</h3>

                                <form autoComplete="off" className="min-w-[50vw] mx-auto bg-white p-6  m-10 rounded-lg shadow-sm" action="#" method="post" onSubmit={(e) => handleFormSubmit(e)}>

                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>


                                    <div className="mb-4">
                                        <label htmlFor="age" className="block text-gray-700 font-medium mb-2">Age</label>
                                        <input
                                            type="text"
                                            name="age"
                                            id="age"
                                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>


                                    <div className="mb-4">
                                        <span className="block text-gray-700 font-medium mb-2">Gender</span>
                                        <div className="flex items-center space-x-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="male"
                                                    className="form-radio text-blue-500"
                                                />
                                                <span className="ml-2">Male</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="female"
                                                    className="form-radio text-blue-500"
                                                />
                                                <span className="ml-2">Female</span>
                                            </label>
                                        </div>
                                    </div>


                                    <div className="mb-4">
                                        <label htmlFor="contact" className="block text-gray-700 font-medium mb-2">Contact</label>
                                        <input
                                            type="text"
                                            name="contact"
                                            id="contact"
                                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>


                                    <div className="mb-4">
                                        <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            id="city"
                                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>


                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`relative bg-[#474E68] hover:bg-[#272829] text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-md ${loading ? "blur-sm opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-lg"}`}
                                        >
                                            {loading ? "Submitting..." : "Submit"}
                                        </button>

                                    </div>
                                </form>




                            </div>
                        </>
                    )
                }
                {
                    view === "list" && (<>
                        <div className="p-4 text-[#0A043C]">

                            <div className="grid gap-4 text-md font-bold text-[#0F044C] border-b pb-2 grid-cols-[1fr_2fr_1fr_2fr_2fr_2fr_auto]">
                                <div>ID</div>
                                <div>NAME</div>
                                <div>AGE</div>
                                <div>GENDER</div>
                                <div>CONTACT</div>
                                <div>CITY</div>
                                <div>EDIT</div>
                            </div>


                            {filteredPatients.map((patient) => (
                                <div
                                    key={patient.id}
                                    className="grid  gap-4 py-3 items-center border-b grid-cols-[1fr_2fr_1fr_2fr_2fr_2fr_auto]"
                                >
                                    <div>{patient.id}</div>
                                    <div>{patient.name}</div>
                                    <div>{patient.age}</div>
                                    <div>{patient.gender}</div>
                                    <div>{patient.contact}</div>
                                    <div>{patient.city}</div>
                                    <div>
                                        <button className="bg-[#474E68] text-white py-1 px-3 rounded hover:bg-[#272829] transition cursor-pointer">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </>)
                }
            </main>
        </div>
    )
}