import { BsPatchCheckFill } from "react-icons/bs";
import InfoCard from "../Components/InfoCart";
import { useEffect, useState } from "react";

export const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const cards = [
    { title: "Total Patients", mainText: "15", badgeValue: 15 },
    { title: "Medicine Stock", mainText: "200 Units", badgeValue: 200 },
    { title: "Doses Dispensed Today", mainText: "85", badgeValue: 85 },
    { title: "Last Dispense Time", mainText: "12:45 PM", badgeValue: null },
    { title: "Error Alerts", mainText: "3", badgeValue: 3 },
    { title: "Battery Level", mainText: "75%", badgeValue: 75 },
    { title: "System Uptime", mainText: "99.8%", badgeValue: null },
    { title: "Connectivity", mainText: "Online", badgeValue: null },
    { title: "Scheduled Maintenance", mainText: "Next: 09/30", badgeValue: null },
  ];

  return (
    <div className="relative p-4">
      <div className="absolute flex items-center gap-2 top-3 right-3 text-right bg-white rounded-sm p-2">
        <div className="h-6 w-6 ">
          {user?.photoURL && <img className="h-full w-full fit-cover rounded-full" src={user?.photoURL} alt='img' />
          }</div>
        <div className="text-sm font-medium text-gray-800">
          {user?.displayName || user?.email || "Welcome"}
        </div>
        <BsPatchCheckFill className="text-blue-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-14">
        {cards.map((card, index) => (
          <InfoCard
            key={index}
            title={card.title}
            mainText={card.mainText}
            badgeValue={card.badgeValue}
          />
        ))}
      </div>
    </div>
  );
};
