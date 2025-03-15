import { useState } from "react";
import { MdArrowBack, MdArrowForward, MdDashboard } from "react-icons/md";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { MdOutlineNotes } from "react-icons/md";
import { Link } from "react-router-dom";

export const Sidebar = () => {
    const [openNav, setOpenNav] = useState(false);

    return (
        <aside
            className={`h-screen ${openNav ? "w-60" : "w-20"} bg-[#1E5F74] text-white flex flex-col items-center gap-5 pt-20 transition-all duration-300 relative `}
        >
            {/* Toggle Button */}
            <div
                onClick={() => setOpenNav(!openNav)}
                className="absolute -right-4 top-2 border-2 bg-amber-50 border-gray-400 h-8 w-8 flex items-center justify-center rounded-2xl cursor-pointer"
            >
                {openNav ? <MdArrowBack size={25} color="gray" /> : <MdArrowForward size={25} color="gray" />}
            </div>

            {/* Sidebar Items */}
            <SidebarItem link="/" openNav={openNav} icon={<MdDashboard size={35} color="#37AFE1" />} label="Dashboard" />
            <SidebarItem link="/patients" openNav={openNav} icon={<BsFillPersonVcardFill size={35} color="#37AFE1" />} label="Patients" />
            <SidebarItem link="/prescription" openNav={openNav} icon={<MdOutlineNotes size={35} color="#37AFE1" />} label="Prescription" />
        </aside>
    );
};

const SidebarItem = ({ openNav, icon, label, link }) => (
    <Link to={link} className={`flex  items-center  ${openNav ? "" : "justify-center"} text-xl font-bold border p-2 rounded-md transition-all duration-300 cursor-pointer hover:bg-[#1D3E53] w-[90%] px-3 ml-5 mr-5`}>
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
