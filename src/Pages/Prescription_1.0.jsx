import { MdShoppingCart } from "react-icons/md";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useState } from "react";

export const Prescription1 = () => {

    const [count, setCount] = useState(1);

    return (
        <div className="p-2 select-none flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full">
                <h2 className="text-2xl font-semibold text-[#0A043C]">Add Prescriptions</h2>
                <div className="h-14 w-14 flex items-center justify-center relative">
                    <MdShoppingCart size={35} color="#1e5f74" />
                    <span className="text-blue-950 bg-blue-300 w-4 h-4 rounded-full absolute top-2 right-2 flex items-center justify-center font-bold text-sm p-1">1</span>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-5 justify-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                    <div key={item} className="h-[240px] w-[240px] border-1 border-gray-400 rounded-md shadow-md flex flex-col items-center justify-center">
                        <img className="w-full h-[140px] object-cover rounded-t-md" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2MpakwoRF3mOMBOSiX9r5u9agRrPSVbtBSg&s"
                            alt={`Prescription ${item}`} />
                            <div className="w-full h-[1px] bg-gray-500"></div>
                        <div className="h-[65px] w-full flex items-center justify-around  gap-5">
                            <button
                                onClick={() => setCount(count - 1)}
                                className="p-3 rounded-l-md bg-gray-300  hover:bg-gray-300 transition-all"
                            >
                                <AiOutlineMinus size={20} />
                            </button>
                            <div  className="py-3 px-10 rounded-md font-bold bg-gray-300 hover:bg-gray-300 transition-all">{count}</div>
                            <button
                                onClick={() => setCount(count + 1)}
                                className="p-3 rounded-r-md bg-gray-300 hover:bg-gray-300 transition-all"
                            >
                                <AiOutlinePlus size={20} />
                            </button>
                        </div>
                        <div className="w-full h-[1px] pb-1 bg-gray-500"></div>

                            <div className="h-[45px] w-full flex items-center bg-cyan-700 rounded-b-md text-white justify-center">
                                ADD
                         </div>

                    </div>
                ))}
            </div>
        </div>
    );
};
