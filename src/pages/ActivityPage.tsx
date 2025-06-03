
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
import ActivityTypeSelector from "@/components/activity/ActivityTypeSelector";
import { useActivityData } from "@/hooks/useActivityData";
import { useLanguage } from "@/contexts/LanguageContext";
import { ActivityType } from "@/types/activity";
import { Play, Square } from "lucide-react";

const ActivityPage = () => {
  const { t } = useLanguage();
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
    handleIncreaseSteps,
    handleDecreaseSteps,
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

  const handleSelectActivity = (activityType: ActivityType) => {
    setSelectedActivityType(activityType);
    if (!isTracking) {
      setIsTracking(true);
    }
  };

  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };
  
  return (
    <div className="pb-20 px-6 max-w-lg mx-auto">
      <PageHeader 
        title={t('navigation.activity')} 
        description={t('activity.description')}
      />
      
      <ActivityStatsCard
        currentActivity={currentActivity}
        stepsGoal={stepsGoal}
        stepsProgress={stepsProgress}
        onOpenAddDialog={() => setIsAddDialogOpen(true)}
        onOpenGoalDialog={() => setIsGoalDialogOpen(true)}
        onIncreaseSteps={handleIncreaseSteps}
        onDecreaseSteps={handleDecreaseSteps}
      />

      <Tabs defaultValue="workouts" className="mb-6">
        <TabsList className="w-full mb-4 grid grid-cols-2">
          <TabsTrigger value="workouts" className="flex-1 text-sm">
            {t('activity.startWorkout')}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 text-sm">
            {t('activity.recentActivity')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="workouts" className="space-y-4">
          <Card className="p-5">
            <ActivityTypeSelector
              activityTypes={activityTypes}
              selectedActivityType={selectedActivityType}
              isTracking={isTracking}
              onSelectActivity={handleSelectActivity}
            />
          </Card>
          
          <Button
            className={`w-full h-14 text-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              isTracking 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg' 
                : 'bg-gradient-to-r from-health-blue to-health-teal hover:from-health-teal hover:to-health-blue shadow-lg'
            }`}
            onClick={toggleTracking}
          >
            <div className="flex items-center gap-3">
              {isTracking ? (
                <>
                  <Square className="h-5 w-5" />
                  {t('activity.stopTracking')}
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  {t('activity.startTracking')}
                </>
              )}
            </div>
          </Button>
        </TabsContent>
        
        <TabsContent value="history">
          <RecentActivitiesList
            recentActivities={recentActivities}
            onViewAllClick={() => setIsHistoryDialogOpen(true)}
          />
        </TabsContent>
      </Tabs>
      
      <WeeklyActivityChart weeklyActivities={weeklyActivities} />
      
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
