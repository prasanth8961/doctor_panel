import { Sidebar } from "./Components/Sidebar";
import { Routes , Route } from "react-router-dom";
import { Dashboard } from "./Pages/Dashboard";
import { Patients } from "./Pages/Patients";
import { Prescription } from "./Pages/Prescription";

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-[#FBFBFB] p-4 overflow-auto flex items-center justify-center">
        <div className="h-[95vh] w-[95vw] bg-[#EFF3EA] overflow-y-auto  rounded">
         
            <Routes>
              <Route index path="/" Component={Dashboard}/>
              <Route path="/patients" Component={Patients}/>
              <Route path="/prescription" Component={Prescription}/>
            </Routes>
         
          
        </div>
      </main>
    </div>
  );
}

export default App;
