import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { usePost } from "../hooks/usePost";
import { useUpdate } from "../hooks/useUpadate";
import AddPatientForm from "../Components/AddPatientForm";
import { useDebounce } from "../hooks/useDebounce";

const DELAY = 300;

export const Patients = () => {
  const [view, setView] = useState("list");
  const [refresh, setRefresh] = useState(false);
  const { data: patients = [], loading: fetching } = useFetch("patients", refresh);
  const { postData, loading } = usePost("patients");

  const { updateData, loading: updating, error } = useUpdate('patients');
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [patientDetails, setPatientDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, DELAY)
  const [selectedGender, setSelectedGender] = useState("all");

  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editPatientInfo, setEditPatientInfo] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      gender: "",
      age: "",
      contact: { phone: "" },
      address: { location: "", pincode: "" }
    },
    medicalInfo: { bloodGroup: "" },
    visitInfo: { reasonForVisit: "", symptoms: "" },
    emergencyContact: { name: "", relation: "", phone: "" }
  });


  useEffect(() => {
    setFilteredPatients(patients);
  }, [patients]);

  useEffect(() => {
    filterPatients(debouncedSearch, selectedGender);
  }, [debouncedSearch, selectedGender]);



  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleGenderInputChange = (e) => {
    setSelectedGender(e.target.value);
  };

  const filterPatients = (query, gender) => {
    let results = [...patients];

    if (gender !== "all") {
      results = results.filter(
        (p) => p.personalInfo.gender.toLowerCase() === gender
      );
    }

    if (query.trim()) {
      results = results.filter((p) =>
        (p.personalInfo.firstName + p.personalInfo.lastName)
          .toLowerCase()
          .includes(query.toLowerCase())
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
    console.log(patient)
    setShowEdit(true);
  };


  const handlePatientDetails = (patientDetail) => {
    setShowPatientDetails(true);
    setPatientDetails(patientDetail);
  }


  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditPatientInfo((prev) => {
      const updated = { ...prev };

      switch (name) {
        case "firstName":
        case "lastName":
        case "gender":
        case "age":
          updated.personalInfo = {
            ...updated.personalInfo,
            [name]: name === "age" ? parseInt(value) : value,
          };
          break;

        case "phone":
          updated.personalInfo = {
            ...updated.personalInfo,
            contact: {
              ...updated.personalInfo.contact,
              phone: value,
            },
          };
          break;

        case "location":
        case "pincode":
          updated.personalInfo = {
            ...updated.personalInfo,
            address: {
              ...updated.personalInfo.address,
              [name]: name === "pincode" ? parseInt(value) : value,
            },
          };
          break;

        case "bloodGroup":
          updated.medicalInfo = {
            ...updated.medicalInfo,
            bloodGroup: value,
          };
          break;

        case "reasonForVisit":
          updated.visitInfo = {
            ...updated.visitInfo,
            reasonForVisit: value,
          };
          break;

        case "symptoms":
          updated.visitInfo = {
            ...updated.visitInfo,
            symptoms: value,
          };
          break;

        case "emergencyName":
          updated.emergencyContact = {
            ...updated.emergencyContact,
            name: value,
          };
          break;

        case "emergencyRelation":
          updated.emergencyContact = {
            ...updated.emergencyContact,
            relation: value,
          };
          break;

        case "emergencyPhone":
          updated.emergencyContact = {
            ...updated.emergencyContact,
            phone: value,
          };
          break;

        default:
          break;
      }

      return updated;
    });
  };


  return (
    <div className="select-none relative">

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


      <main className="p-4 overflow-y-auto">
        {view === "add" && (
          <AddPatientForm />
        )}

        {view === "list" && (
          <>
            {
              fetching ? <div className="animate-pulse space-y-4 p-4">

                <div className="h-12 bg-gray-300 rounded w-full"></div>


                <div className="space-y-2">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex space-x-4">
                      <div className="h-10 w-1/6 bg-gray-200 rounded"></div>
                      <div className="h-10 w-1/6 bg-gray-200 rounded"></div>
                      <div className="h-10 w-1/6 bg-gray-200 rounded"></div>
                      <div className="h-10 w-1/6 bg-gray-200 rounded"></div>
                      <div className="h-10 w-1/6 bg-gray-200 rounded"></div>
                      <div className="h-10 w-1/6 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
                : <>{
                  filteredPatients.length > 0 ? (<div className="mt-4 overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-200 text-md font-bold text-[#0F044C]">
                          <th className="border border-gray-300 px-4 py-2 text-left w-[10%]">ID</th>
                          <th className="border border-gray-300 px-4 py-2 text-left w-[20%]">NAME</th>
                          <th className="border border-gray-300 px-4 py-2 text-left w-[10%]">AGE</th>
                          <th className="border border-gray-300 px-4 py-2 text-left w-[10%]">GENDER</th>
                          <th className="border border-gray-300 px-4 py-2 text-left w-[15%]">CONTACT</th>
                          <th className="border border-gray-300 px-4 py-2 text-left w-[15%]">LOCATION</th>
                          <th className="border border-gray-300 px-4 py-2 text-left w-[20%]">ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPatients.map((p) => (
                          <tr key={p.id} className="border-t border-gray-300">
                            <td className="border border-gray-300 px-4 py-2">{p.id}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              {p.personalInfo?.firstName} {p.personalInfo?.lastName}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{p.personalInfo?.age}</td>
                            <td className="border border-gray-300 px-4 py-2">{p.personalInfo?.gender}</td>
                            <td className="border border-gray-300 px-4 py-2">{p.personalInfo?.contact?.phone}</td>
                            <td className="border border-gray-300 px-4 py-2">{p.personalInfo?.address?.location}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handlePatientDetails(p)}
                                  className="bg-[#474E68] text-white py-1 px-3 cursor-pointer rounded hover:bg-[#272829] transition"
                                >
                                  More
                                </button>
                                <button
                                  onClick={() => handleEdit(p.id)}
                                  className="bg-[#474E68] text-white py-1 px-3 cursor-pointer rounded hover:bg-[#272829] transition"
                                >
                                  Edit
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  ) : (<div className="w-full flex flex-col items-center justify-center text-center py-16 mt-[25vh]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 14v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                      />
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-700">No Patients Found</h2>
                    <p className="text-sm text-gray-500 mt-1">Try refreshing or adding a new patient.</p>
                    <div
                      onClick={() => setRefresh((prev) => !prev)}
                      className="mt-4 px-4 py-2 bg-blue-900 cursor-pointer text-white rounded hover:bg-blue-950"
                    >
                      Refresh
                    </div> </div>
                  )
                }</>
            }



          </>


        )}

        {showEdit && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg p-6 relative">

              <button
                onClick={() => setShowEdit(false)}
                className="absolute top-4 right-4  bg-red-200 text-red-900 cursor-pointer hover:text-red-900 hover:bg-red-400 rounded-md w-9 h-9 flex items-center justify-center"
                aria-label="Close"
              >
                &times;
              </button>

              <h2 className="text-2xl sm:text-3xl font-bold text-start text-blue-900 mb-6">Edit Patient</h2>

              <form onSubmit={handleFormUpdate}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">First Name</label>
                    <input
                      name="firstName"
                      value={editPatientInfo.personalInfo.firstName || ""}
                      onChange={handleEditInputChange}
                      required
                      className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Last Name</label>
                    <input
                      name="lastName"
                      value={editPatientInfo.personalInfo.lastName || ""}
                      onChange={handleEditInputChange}
                      required
                      className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Gender</label>
                    <select
                      name="gender"
                      value={editPatientInfo.personalInfo.gender || ""}
                      onChange={handleEditInputChange}
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
                      value={editPatientInfo.personalInfo.age || ""}
                      onChange={handleEditInputChange}
                      required
                      className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                    <input
                      name="phone"
                      value={editPatientInfo.personalInfo.contact.phone || ""}
                      onChange={handleEditInputChange}
                      required
                      className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={editPatientInfo.medicalInfo.bloodGroup || ""}
                      onChange={handleEditInputChange}
                      className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                    >
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
                    <input
                      name="location"
                      value={editPatientInfo.personalInfo.address.location || ""}
                      onChange={handleEditInputChange}
                      required
                      className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Pincode</label>
                    <input
                      name="pincode"
                      type="number"
                      value={editPatientInfo.personalInfo.address.pincode || ""}
                      onChange={handleEditInputChange}
                      required
                      className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Reason for Visit</label>
                    <input
                      name="reasonForVisit"
                      value={editPatientInfo.visitInfo.reasonForVisit || ""}
                      onChange={handleEditInputChange}
                      required
                      className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                    />
                  </div>


                  <div className="sm:col-span-3">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Symptoms</label>
                    <input
                      name="symptoms"
                      value={editPatientInfo.visitInfo.symptoms || ""}
                      onChange={handleEditInputChange}
                      required
                      placeholder="e.g. fever, cough"
                      className="w-full border py-4 px-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Emergency Contact Name</label>
                    <input
                      name="emergencyName"
                      value={editPatientInfo.emergencyContact.name || ""}
                      onChange={handleEditInputChange}
                      required
                      className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Relation</label>
                    <input
                      name="emergencyRelation"
                      value={editPatientInfo.emergencyContact.relation || ""}
                      onChange={handleEditInputChange}
                      required
                      className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Emergency Phone</label>
                    <input
                      name="emergencyPhone"
                      value={editPatientInfo.emergencyContact.phone || ""}
                      onChange={handleEditInputChange}
                      required
                      className="w-full border p-2 border-gray-400 rounded focus:ring focus:ring-blue-950"
                    />
                  </div>
                </div>


                <div className="mt-6 text-end">
                  <button
                    type="submit"
                    disabled={updating}
                    className={`bg-blue-900 text-white font-semibold px-8 py-2 rounded shadow transition-all duration-300 ease-in-out ${updating
                      ? "opacity-60 blur-[1px] cursor-not-allowed"
                      : "hover:bg-blue-950 cursor-pointer"
                      }`}
                  >
                    {updating ? "Updating..." : "Update Patient"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPatientDetails && patientDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative">

              <button
                onClick={() => setShowPatientDetails(false)}
                className="absolute top-4 right-4 text-red-600 bg-red-200 cursor-pointer  hover:text-white hover:bg-red-400 rounded-md w-9 h-9 flex items-center justify-center"
                aria-label="Close"
              >
                &times;
              </button>


              <h2 className="text-2xl font-bold text-center text-blue-900 mb-6 border-b pb-2">
                Patient Details
              </h2>

              <div className="space-y-6 text-sm text-gray-800">

                <div>
                  <h3 className="text-base font-semibold text-blue-700 mb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoRow label="Patient ID" value={patientDetails.id} />
                    <InfoRow
                      label="Name"
                      value={`${patientDetails.personalInfo.firstName} ${patientDetails.personalInfo.lastName}`}
                    />
                    <InfoRow label="Gender" value={patientDetails.personalInfo.gender} />
                    <InfoRow label="Age" value={patientDetails.personalInfo.age} />
                    <InfoRow label="Phone" value={patientDetails.personalInfo.contact.phone} />
                    <InfoRow
                      label="City"
                      value={patientDetails.personalInfo.address?.location || "N/A"}
                    />
                    <InfoRow
                      label="Pincode"
                      value={patientDetails.personalInfo.address?.pincode || "N/A"}
                    />
                  </div>
                </div>


                <div>
                  <h3 className="text-base font-semibold text-blue-700 mb-2">Medical Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoRow label="Blood Group" value={patientDetails.medicalInfo.bloodGroup} />
                  </div>
                </div>


                <div>
                  <h3 className="text-base font-semibold text-blue-700 mb-2">Visit Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoRow label="Reason for Visit" value={patientDetails.visitInfo.reasonForVisit} />
                    <InfoRow
                      label="Symptoms"
                      value={patientDetails.visitInfo.symptoms?.join(", ") || "N/A"}
                    />
                  </div>
                </div>


                <div>
                  <h3 className="text-base font-semibold text-blue-700 mb-2">Emergency Contact</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoRow label="Name" value={patientDetails.emergencyContact.name} />
                    <InfoRow label="Relation" value={patientDetails.emergencyContact.relation} />
                    <InfoRow label="Phone" value={patientDetails.emergencyContact.phone} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div>
    <div className="text-xs text-gray-500 uppercase">{label}</div>
    <div className="text-sm font-medium">{value || "—"}</div>
  </div>
);
