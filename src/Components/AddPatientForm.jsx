import { useState } from "react";
import { app } from "../Firebase/firebase_config";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import toast from "../Utils/toast";

export default function AddPatientForm() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "Male",
        age: "",
        phone: "",
        bloodGroup: "A+",
        reasonForVisit: "",
        symptoms: "",
        emergencyName: "",
        emergencyRelation: "",
        emergencyPhone: "",
        location: "",
        pincode: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addPatient = async (e) => {
        e.preventDefault();
        const db = getFirestore(app);
        setLoading(true);
        try {
            const patientData = {
                id: Math.floor(1000 + Math.random() * 9000).toString(),
                personalInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    gender: formData.gender,
                    age: parseInt(formData.age),
                    contact: {
                        phone: formData.phone
                    },
                    address: {
                        location: formData.location,
                        pincode: formData.pincode
                    }
                },
                medicalInfo: {
                    bloodGroup: formData.bloodGroup
                },
                visitInfo: {
                    reasonForVisit: formData.reasonForVisit,
                    symptoms: formData.symptoms.split(",").map(s => s.trim())
                },
                emergencyContact: {
                    name: formData.emergencyName,
                    relation: formData.emergencyRelation,
                    phone: formData.emergencyPhone
                },
            };

            const docRef = doc(db, "patients", patientData.id);
            await setDoc(docRef, patientData);
            toast.success("Patient added successfully.");
            setFormData({
                firstName: "",
                lastName: "",
                gender: "Male",
                age: "",
                phone: "",
                bloodGroup: "A+",
                reasonForVisit: "",
                symptoms: "",
                emergencyName: "",
                emergencyRelation: "",
                emergencyPhone: "",
                location: "",
                pincode: ""
            });

        } catch (_) {
            toast.error("Something went wrong.")
        }
        finally {
            setLoading(false)
        }
    };

    return (
        <form
            onSubmit={addPatient}
            autoComplete="off"
            className="w-full h-full flex items-start justify-center px-4 py-6 lg:items-center"
        >
            <div className="w-full max-w-6xl bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-start text-blue-950 mb-6">New Patient</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">First Name</label>
                        <input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            placeholder=""
                            className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Last Name</label>
                        <input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            placeholder=""
                            className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                        >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Age</label>
                        <input
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 34"
                            className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+91-9876543210"
                            className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Blood Group</label>
                        <select
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleChange}
                            className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                        >
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Mumbai"
                            className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Pincode</label>
                        <input
                            name="pincode"
                            type="number"
                            value={formData.pincode}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 400001"
                            className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                        />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Reason for Visit</label>
                        <input
                            name="reasonForVisit"
                            value={formData.reasonForVisit}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Chest pain"
                            className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                        />
                    </div>
                    <div className="sm:col-span-3 lg:col-span-3">
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Symptoms</label>
                        <input
                            name="symptoms"
                            value={formData.symptoms}
                            onChange={handleChange}
                            required
                            placeholder="Comma-separated (e.g. fatigue, cough)"
                            className="w-full border py-4 px-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Emergency Contact Name</label>
                        <input
                            name="emergencyName"
                            value={formData.emergencyName}
                            onChange={handleChange}
                            required
                            placeholder=""
                            className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Relation</label>
                        <input
                            name="emergencyRelation"
                            value={formData.emergencyRelation}
                            onChange={handleChange}
                            required
                            placeholder="Wife / Parent"
                            className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Emergency Phone</label>
                        <input
                            name="emergencyPhone"
                            value={formData.emergencyPhone}
                            onChange={handleChange}
                            required
                            placeholder="+91-9876543211"
                            className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                        />
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-900 text-white font-semibold px-8 py-2 rounded shadow transition-all duration-300 ease-in-out ${loading
                            ? "opacity-60 blur-[1px] cursor-not-allowed"
                            : "hover:bg-blue-950 cursor-pointer"
                            }`}
                    >
                        {loading ? "Adding..." : "Add New Patient"}
                    </button>

                </div>
            </div>
        </form>
    );
}
