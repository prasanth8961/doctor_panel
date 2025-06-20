import { useState } from "react";
import { MdArrowBack, MdArrowForward, MdDashboard } from "react-icons/md";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { MdOutlineNotes } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { SiAegisauthenticator } from "react-icons/si";
import { BiLogOut } from "react-icons/bi";
import {app} from '../Firebase/firebase_config';
import { getAuth, signOut } from "firebase/auth";

export const Sidebar = () => {
    const [openNav, setOpenNav] = useState(false);
    const navigate = useNavigate();

    const auth = getAuth(app)

    const handleLogout = async() => {
        try {
            await signOut(auth);
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            navigate("/auth");
        } catch (err) {
            console.error("Logout failed:", err.message);
        }
    };
    return (
        <aside
            className={`h-screen ${openNav ? "w-60" : "w-20"} bg-[#1E5F74] text-white flex flex-col items-center gap-5 pt-20 transition-all duration-300 relative `}
        >
            {/* Toggle Button */}
            <div
                onClick={() => setOpenNav(!openNav)}
                className="absolute -right-4 top-2 border-2 bg-amber-50 border-[#1E5F74]  h-8 w-8 flex items-center justify-center rounded-2xl cursor-pointer"
            >
                {openNav ? <MdArrowBack size={25} color="#1E5F74" /> : <MdArrowForward size={25} color="#1E5F74" />}
            </div>
            <SidebarItem link="/" openNav={openNav} icon={<MdDashboard size={35} color="#37AFE1" />} label="Dashboard" />
            <SidebarItem link="/patients" openNav={openNav} icon={<BsFillPersonVcardFill size={35} color="#37AFE1" />} label="Patients" />
            <SidebarItem link="/prescription" openNav={openNav} icon={<MdOutlineNotes size={35} color="#37AFE1" />} label="Prescription" />
            <div
                onClick={handleLogout}
                className={`absolute bottom-5 flex  items-center  ${openNav ? "" : "justify-center"} text-xl font-bold border py-2 rounded-md transition-all duration-300 cursor-pointer hover:bg-[#1D3E53] w-[90%] px-2 ml-5 mr-5`}
            >
                <BiLogOut size={28} color="#37AFE1" />
                {openNav && <span className={`
        inline-block overflow-hidden transition-all duration-300 whitespace-nowrap text-[#37AFE1]
        ${openNav ? "opacity-100 pl-3" : "w-0 opacity-0"}
      `}>Logout</span>}
            </div>
        </aside>
    );
};

const SidebarItem = ({ openNav, icon, label, link }) => (
    <Link to={link} className={`flex  items-center  ${openNav ? "" : "justify-center"} text-xl font-bold border py-2 rounded-md transition-all duration-300 cursor-pointer hover:bg-[#1D3E53] w-[90%] px-2 ml-5 mr-5`}>
        {icon}
        <span
            className={`
        inline-block overflow-hidden transition-all duration-300 whitespace-nowrap text-[#37AFE1]
        ${openNav ? "opacity-100 pl-3" : "w-0 opacity-0"}
      `}
        >
            {label}
        </span>
    </Link>
);
