
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/PageHeader";
import BottomNavigation from "@/components/BottomNavigation";
import ActivityStatsCard from "@/components/activity/ActivityStatsCard";
import WeeklyActivityChart from "@/components/activity/WeeklyActivityChart";
import AddActivityDialog from "@/components/activity/AddActivityDialog";
import SetGoalDialog from "@/components/activity/SetGoalDialog";
import ActivityHistoryDialog from "@/components/activity/ActivityHistoryDialog";
import RecentActivitiesList from "@/components/activity/RecentActivitiesList";
import { useActivityData } from "@/hooks/useActivityData";
import { ActivityType } from "@/types/activity";
import { Activity } from "lucide-react";

const ActivityPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  
  const {
    isTracking,
    setIsTracking,
    activities,
    stepsGoal,
    newSteps,
    setNewSteps,
    newStepsGoal,
    setNewStepsGoal,
    selectedActivityType,
    setSelectedActivityType,
    currentActivity,
    stepsProgress,
    handleAddActivity,
    handleUpdateGoal,
    getWeeklyActivities,
    getRecentActivities
  } = useActivityData();
  
  const activityTypes: ActivityType[] = ["walking", "running", "cycling", "hiking", "swimming", "gym"];
  const weeklyActivities = getWeeklyActivities();
  const recentActivities = getRecentActivities();
  
  const handleAddActivityConfirm = () => {
    const success = handleAddActivity();
    if (success) {
      setIsAddDialogOpen(false);
    }
  };
  
  const handleUpdateGoalConfirm = () => {
    const success = handleUpdateGoal();
    if (success) {
      setIsGoalDialogOpen(false);
    }
  };
  
  return (
    <div className="pb-20 px-6 max-w-lg mx-auto">
      <PageHeader 
        title="Activity Tracking" 
        description="Monitor your daily movement and exercise"
      />
      
      <ActivityStatsCard
        currentActivity={currentActivity}
        stepsGoal={stepsGoal}
        stepsProgress={stepsProgress}
        onOpenAddDialog={() => setIsAddDialogOpen(true)}
        onOpenGoalDialog={() => setIsGoalDialogOpen(true)}
      />

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
          <RecentActivitiesList
            recentActivities={recentActivities}
            onViewAllClick={() => setIsHistoryDialogOpen(true)}
          />
        </TabsContent>
      </Tabs>
      
      <WeeklyActivityChart weeklyActivities={weeklyActivities} />
      
      <Button
        className={`w-full ${isTracking ? 'bg-red-500 hover:bg-red-600' : 'bg-health-blue hover:bg-blue-600'}`}
        onClick={() => setIsTracking(!isTracking)}
      >
        {isTracking ? 'Stop Tracking' : 'Start Tracking'}
      </Button>
      
      <AddActivityDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        activityTypes={activityTypes}
        selectedActivityType={selectedActivityType}
        setSelectedActivityType={setSelectedActivityType}
        newSteps={newSteps}
        setNewSteps={setNewSteps}
        onAddActivity={handleAddActivityConfirm}
      />
      
      <SetGoalDialog
        isOpen={isGoalDialogOpen}
        onOpenChange={setIsGoalDialogOpen}
        newStepsGoal={newStepsGoal}
        setNewStepsGoal={setNewStepsGoal}
        onUpdateGoal={handleUpdateGoalConfirm}
      />
      
      <ActivityHistoryDialog
        isOpen={isHistoryDialogOpen}
        onOpenChange={setIsHistoryDialogOpen}
        activities={activities}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default ActivityPage;
