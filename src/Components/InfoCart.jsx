// InfoCard.js
import React from "react";

const InfoCard = ({ title = "Patients Count", mainText = "View", badgeValue = null }) => {
  return (
    <div className="relative h-[7rem] w-[18rem] bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title}
        </div>
        <div className="text-3xl font-bold text-gray-800">
          {mainText}
        </div>
      </div>
      {badgeValue !== null && (<div className="absolute -top-3 -right-3 transform translate-x-1/4 -translate-y-1/4 h-25 w-25 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 hover:scale-110">

        <span className="text-2xl font-bold text-white pr-8 pt-6">
          {badgeValue}
        </span>

      </div>)
      }
    </div>
  );
};

export default InfoCard;
