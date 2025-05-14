
import { useState } from "react";
import { Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import ActivityRing from "@/components/ActivityRing";
import BottomNavigation from "@/components/BottomNavigation";

const ActivityPage = () => {
  const [isTracking, setIsTracking] = useState(false);
  
  return (
    <div className="pb-20 px-6 max-w-lg mx-auto">
      <PageHeader 
        title="Activity Tracking" 
        description="Monitor your daily movement and exercise"
      />
      
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Today's Progress</h3>
          <span className="text-sm text-gray-500">Goal: 10,000 steps</span>
        </div>
        
        <div className="flex justify-center mb-6">
          <ActivityRing
            progress={74}
            size={180}
            strokeWidth={12}
            color="#3b82f6"
            label="Steps"
            value="7,384"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Distance</p>
            <p className="text-lg font-bold">5.2 km</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Calories</p>
            <p className="text-lg font-bold">326 kcal</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Time</p>
            <p className="text-lg font-bold">47 min</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-5 mb-6">
        <h3 className="font-medium mb-3">Start Workout</h3>
        <div className="grid grid-cols-3 gap-3">
          {["Walking", "Running", "Cycling", "Swimming", "Hiking", "Gym"].map((activity) => (
            <Button 
              key={activity}
              variant="outline"
              className="h-20 flex flex-col justify-center items-center border-2"
            >
              <Activity className="h-5 w-5 mb-1" />
              <span className="text-xs">{activity}</span>
            </Button>
          ))}
        </div>
      </Card>
      
      <Card className="p-5 mb-6">
        <h3 className="font-medium mb-3">Weekly Activity</h3>
        <div className="flex justify-between items-end h-40 pt-10">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
            const heights = [40, 60, 25, 70, 45, 90, 30];
            const heightPercent = heights[index];
            const isToday = index === 3; // Assuming Thursday is today
            
            return (
              <div key={day} className="flex flex-col items-center">
                <div 
                  className={`w-8 rounded-t-md ${isToday ? 'bg-health-blue' : 'bg-gray-200'}`}
                  style={{ height: `${heightPercent}%` }}
                />
                <p className="text-xs mt-2">{day}</p>
              </div>
            );
          })}
        </div>
      </Card>
      
      <Button
        className={`w-full ${isTracking ? 'bg-red-500 hover:bg-red-600' : 'bg-health-blue hover:bg-blue-600'}`}
        onClick={() => setIsTracking(!isTracking)}
      >
        {isTracking ? 'Stop Tracking' : 'Start Tracking'}
      </Button>
      
      <BottomNavigation />
    </div>
  );
};

export default ActivityPage;
