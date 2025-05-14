
import { useState, useEffect } from "react";
import { Activity, Edit, ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import ActivityRing from "@/components/ActivityRing";
import BottomNavigation from "@/components/BottomNavigation";

interface DailyActivity {
  date: string;
  steps: number;
  distance: number;
  calories: number;
  duration: number; // in minutes
}

const ActivityPage = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSteps, setNewSteps] = useState("");
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const stepsGoal = 10000;
  
  useEffect(() => {
    const savedActivities = localStorage.getItem("activityData");
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    } else {
      // Default activity if nothing is saved
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      const initialActivity = {
        date: today,
        steps: 7384,
        distance: 5.2,
        calories: 326,
        duration: 47
      };
      setActivities([initialActivity]);
      localStorage.setItem("activityData", JSON.stringify([initialActivity]));
    }
  }, []);
  
  const getCurrentActivity = () => {
    return activities.length > 0 ? activities[activities.length - 1] : { steps: 0, distance: 0, calories: 0, duration: 0, date: "" };
  };
  
  const currentActivity = getCurrentActivity();
  const stepsProgress = Math.min(100, Math.round((currentActivity.steps / stepsGoal) * 100));
  
  const handleAddActivity = () => {
    if (!newSteps || isNaN(Number(newSteps))) {
      toast({
        title: "Invalid steps",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return;
    }
    
    const steps = parseInt(newSteps);
    
    // Calculate approximate values based on steps
    const distance = +(steps * 0.0007).toFixed(1); // km
    const calories = Math.round(steps * 0.04); // kcal
    const duration = Math.round(steps * 0.01); // minutes
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    
    const newActivity = {
      date: today,
      steps,
      distance,
      calories,
      duration
    };
    
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    localStorage.setItem("activityData", JSON.stringify(updatedActivities));
    
    setNewSteps("");
    setIsAddDialogOpen(false);
    
    toast({
      title: "Activity added",
      description: `Added ${steps} steps to your activity log`,
    });
  };
  
  const getWeeklyActivities = () => {
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date().getDay(); // 0 is Sunday
    const todayIndex = today === 0 ? 6 : today - 1; // Convert to 0-indexed Monday start
    
    return weekdays.map((day, index) => {
      const activity = activities.find(a => a.date === day);
      const steps = activity ? activity.steps : 0;
      const heightPercent = Math.min(90, Math.max(10, Math.round((steps / stepsGoal) * 100)));
      const isToday = index === todayIndex;
      
      return { day, steps, heightPercent, isToday };
    });
  };
  
  return (
    <div className="pb-20 px-6 max-w-lg mx-auto">
      <PageHeader 
        title="Activity Tracking" 
        description="Monitor your daily movement and exercise"
      />
      
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Today's Progress</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Goal: {stepsGoal.toLocaleString()} steps</span>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center mb-6">
          <ActivityRing
            progress={stepsProgress}
            size={180}
            strokeWidth={12}
            color="#3b82f6"
            label="Steps"
            value={currentActivity.steps.toLocaleString()}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Distance</p>
            <p className="text-lg font-bold">{currentActivity.distance} km</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Calories</p>
            <p className="text-lg font-bold">{currentActivity.calories} kcal</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Time</p>
            <p className="text-lg font-bold">{currentActivity.duration} min</p>
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
          {getWeeklyActivities().map((item) => (
            <div key={item.day} className="flex flex-col items-center">
              <div 
                className={`w-8 rounded-t-md ${item.isToday ? 'bg-health-blue' : 'bg-gray-200'}`}
                style={{ height: `${item.heightPercent}%` }}
              />
              <p className="text-xs mt-2">{item.day}</p>
              <p className="text-xs text-gray-500">{item.steps > 0 ? (item.steps / 1000).toFixed(1) + 'k' : '-'}</p>
            </div>
          ))}
        </div>
      </Card>
      
      <Button
        className={`w-full ${isTracking ? 'bg-red-500 hover:bg-red-600' : 'bg-health-blue hover:bg-blue-600'}`}
        onClick={() => setIsTracking(!isTracking)}
      >
        {isTracking ? 'Stop Tracking' : 'Start Tracking'}
      </Button>
      
      {/* Dialog for entering steps */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Steps</DialogTitle>
            <DialogDescription>
              Enter your step count for today
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              placeholder="Enter steps"
              value={newSteps}
              onChange={(e) => setNewSteps(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-health-blue hover:bg-blue-600" onClick={handleAddActivity}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default ActivityPage;
