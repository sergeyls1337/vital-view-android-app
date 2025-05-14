
import { useState, useEffect } from "react";
import { Activity, Edit, ArrowUp, ArrowDown, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import PageHeader from "@/components/PageHeader";
import ActivityRing from "@/components/ActivityRing";
import BottomNavigation from "@/components/BottomNavigation";

interface DailyActivity {
  date: string;
  steps: number;
  distance: number;
  calories: number;
  duration: number; // in minutes
  activityType?: string; // New property for tracking activity type
}

const ActivityPage = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [newSteps, setNewSteps] = useState("");
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [stepsGoal, setStepsGoal] = useState(10000);
  const [newStepsGoal, setNewStepsGoal] = useState("10000");
  const [selectedActivityType, setSelectedActivityType] = useState("walking");
  
  useEffect(() => {
    // Load activities from localStorage
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
    
    // Load user's custom goal from localStorage
    const savedGoal = localStorage.getItem("stepsGoal");
    if (savedGoal) {
      setStepsGoal(parseInt(savedGoal));
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
    
    // Calculate approximate values based on steps and activity type
    let distance = +(steps * 0.0007).toFixed(1); // km
    let calories = Math.round(steps * 0.04); // kcal
    let duration = Math.round(steps * 0.01); // minutes
    
    // Adjust calculations based on activity type
    if (selectedActivityType === "running") {
      distance = +(steps * 0.0009).toFixed(1);
      calories = Math.round(steps * 0.06);
      duration = Math.round(steps * 0.008);
    } else if (selectedActivityType === "cycling") {
      distance = +(steps * 0.003).toFixed(1);
      calories = Math.round(steps * 0.05);
      duration = Math.round(steps * 0.015);
    }
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    
    const newActivity = {
      date: today,
      steps,
      distance,
      calories,
      duration,
      activityType: selectedActivityType
    };
    
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    localStorage.setItem("activityData", JSON.stringify(updatedActivities));
    
    setNewSteps("");
    setIsAddDialogOpen(false);
    
    toast({
      title: "Activity added",
      description: `Added ${steps} steps from ${selectedActivityType} to your activity log`,
    });
  };
  
  const handleUpdateGoal = () => {
    if (!newStepsGoal || isNaN(Number(newStepsGoal))) {
      toast({
        title: "Invalid goal",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return;
    }
    
    const goal = parseInt(newStepsGoal);
    setStepsGoal(goal);
    localStorage.setItem("stepsGoal", String(goal));
    setIsGoalDialogOpen(false);
    
    toast({
      title: "Goal updated",
      description: `Your daily steps goal is now ${goal.toLocaleString()} steps`,
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

  const getRecentActivities = () => {
    // Return the most recent 5 activities
    return [...activities].reverse().slice(0, 5);
  };

  const activityTypes = ["walking", "running", "cycling", "hiking", "swimming", "gym"];
  
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
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsGoalDialogOpen(true)}
            >
              <Settings className="h-4 w-4" />
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

      <Tabs defaultValue="workouts" className="mb-6">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="workouts" className="flex-1">Start Workout</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workouts">
          <Card className="p-5">
            <h3 className="font-medium mb-3">Quick Start</h3>
            <div className="grid grid-cols-3 gap-3">
              {activityTypes.map((activity) => (
                <Button 
                  key={activity}
                  variant="outline"
                  className={`h-20 flex flex-col justify-center items-center border-2 ${
                    isTracking && selectedActivityType === activity ? 'border-health-blue' : ''
                  }`}
                  onClick={() => {
                    setSelectedActivityType(activity);
                    setIsTracking(true);
                  }}
                >
                  <Activity className="h-5 w-5 mb-1" />
                  <span className="text-xs">{activity.charAt(0).toUpperCase() + activity.slice(1)}</span>
                </Button>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Recent Activities</h3>
              <Button 
                variant="ghost" 
                className="text-sm h-8 px-2"
                onClick={() => setIsHistoryDialogOpen(true)}
              >
                View All
              </Button>
            </div>
            {getRecentActivities().map((activity, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{activity.date}</p>
                  <p className="text-xs text-gray-500">{activity.activityType || 'walking'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{activity.steps.toLocaleString()} steps</p>
                  <p className="text-xs text-gray-500">{activity.distance} km</p>
                </div>
              </div>
            ))}
          </Card>
        </TabsContent>
      </Tabs>
      
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
              Enter your step count and select activity type
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Steps</label>
              <Input
                type="number"
                placeholder="Enter steps"
                value={newSteps}
                onChange={(e) => setNewSteps(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Activity Type</label>
              <div className="grid grid-cols-3 gap-2">
                {activityTypes.map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={selectedActivityType === type ? "default" : "outline"}
                    className="text-xs py-1"
                    onClick={() => setSelectedActivityType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
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

      {/* Dialog for setting goals */}
      <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Daily Goal</DialogTitle>
            <DialogDescription>
              Update your daily step count goal
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Daily Step Goal</label>
              <Input
                type="number"
                placeholder="Enter goal"
                value={newStepsGoal}
                onChange={(e) => setNewStepsGoal(e.target.value)}
                className="w-full mb-2"
              />
              <div className="pt-4">
                <label className="text-sm font-medium mb-2 block">Quick Select</label>
                <div className="flex flex-wrap gap-2">
                  {[5000, 7500, 10000, 12500, 15000].map((goal) => (
                    <Button
                      key={goal}
                      type="button"
                      variant={newStepsGoal === goal.toString() ? "default" : "outline"}
                      className="text-xs py-1"
                      onClick={() => setNewStepsGoal(goal.toString())}
                    >
                      {goal.toLocaleString()}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGoalDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-health-blue hover:bg-blue-600" onClick={handleUpdateGoal}>
              Update Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for activity history */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Activity History</DialogTitle>
            <DialogDescription>
              View your complete activity history
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {activities.length === 0 ? (
              <p className="text-center text-gray-500">No activities recorded yet</p>
            ) : (
              activities.map((activity, index) => (
                <div key={index} className="mb-4 p-3 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">{activity.date}</p>
                    <p className="text-sm text-gray-500">{activity.activityType || 'walking'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Steps</p>
                      <p className="font-bold">{activity.steps.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Distance</p>
                      <p className="font-bold">{activity.distance} km</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Calories</p>
                      <p className="font-bold">{activity.calories} kcal</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-bold">{activity.duration} min</p>
                    </div>
                  </div>
                </div>
              )).reverse()
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsHistoryDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default ActivityPage;
