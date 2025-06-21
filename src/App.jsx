import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./Components/Sidebar";
import { Dashboard } from "./Pages/Dashboard";
import { Patients } from "./Pages/Patients";
import { Prescription } from "./Pages/Prescription";
import { Auth } from "./Pages/Auth";
import { PrivateRoute } from "./Routes/PrivateRoute";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="flex h-screen">
                <Sidebar />
                <main className="flex-1 bg-[#FBFBFB] p-4 overflow-auto flex items-center justify-center">
                  <div className="h-[95vh] w-[95vw] bg-[#EFF3EA] overflow-y-auto rounded-md">
                    <Routes>
                      <Route index element={<Dashboard />} />
                      <Route path="patients" element={<Patients />} />
                      <Route path="prescription" element={<Prescription />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}

export default App;
