import InfoCard from "../Components/InfoCart"

export const Dashboard = () => {
    
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
          {cards.map((card, index) => (
            <InfoCard 
              key={index}
              title={card.title}
              mainText={card.mainText}
              badgeValue={card.badgeValue}
            />
          ))}
        </div>
      );
}