
import { useState } from "react";
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import BottomNavigation from "@/components/BottomNavigation";
import WaterIntakeControl from "@/components/WaterIntakeControl";

const WaterPage = () => {
  const [waterIntake, setWaterIntake] = useState(1200);
  const dailyGoal = 2000;
  
  const handleWaterIntakeChange = (amount: number) => {
    setWaterIntake(prev => Math.max(0, prev + amount));
  };
  
  return (
    <div className="pb-20 px-6 max-w-lg mx-auto">
      <PageHeader 
        title="Water Intake" 
        description="Track your daily hydration"
      />
      
      <Card className="p-6 mb-6 flex flex-col items-center">
        <WaterIntakeControl 
          onWaterIntakeChange={handleWaterIntakeChange}
          currentIntake={waterIntake}
          dailyGoal={dailyGoal}
        />
      </Card>
      
      <Card className="p-5 mb-6">
        <h3 className="font-medium mb-4">Today's Log</h3>
        <div className="space-y-3">
          {[
            { time: "8:00 AM", amount: 250 },
            { time: "10:30 AM", amount: 300 },
            { time: "12:45 PM", amount: 350 },
            { time: "3:15 PM", amount: 300 },
          ].map((entry, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-health-blue rounded-full mr-3" />
                <span>{entry.time}</span>
              </div>
              <span className="font-medium">{entry.amount} ml</span>
            </div>
          ))}
        </div>
      </Card>
      
      <Card className="p-5">
        <h3 className="font-medium mb-3">Weekly Overview</h3>
        <div className="flex justify-between items-end h-40 pt-10">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
            const heights = [60, 75, 45, 60, 50, 80, 0];
            const heightPercent = heights[index];
            const isToday = index === 3; // Assuming Thursday is today
            
            return (
              <div key={day} className="flex flex-col items-center">
                <div 
                  className={`w-8 rounded-t-md ${isToday ? 'bg-health-teal' : 'bg-blue-100'}`}
                  style={{ height: `${heightPercent}%` }}
                />
                <p className="text-xs mt-2">{day}</p>
              </div>
            );
          })}
        </div>
      </Card>
      
      <BottomNavigation />
    </div>
  );
};

export default WaterPage;
