
import { Activity, Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Settings } from "lucide-react";
import ActivityRing from "@/components/ActivityRing";
import { DailyActivity } from "@/types/activity";

interface ActivityStatsCardProps {
  currentActivity: DailyActivity;
  stepsGoal: number;
  stepsProgress: number;
  onOpenAddDialog: () => void;
  onOpenGoalDialog: () => void;
  onIncreaseSteps: () => void;
  onDecreaseSteps: () => void;
}

const ActivityStatsCard = ({ 
  currentActivity, 
  stepsGoal, 
  stepsProgress,
  onOpenAddDialog,
  onOpenGoalDialog,
  onIncreaseSteps,
  onDecreaseSteps
}: ActivityStatsCardProps) => {
  return (
    <Card className="p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Today's Progress</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Goal: {stepsGoal.toLocaleString()} steps</span>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={onOpenAddDialog}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={onOpenGoalDialog}
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
          value={currentActivity.steps?.toLocaleString() || '0'}
        />
      </div>

      <div className="flex items-center justify-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="icon"
          className="h-10 w-10"
          onClick={onDecreaseSteps}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <p className="text-2xl font-bold">{currentActivity.steps?.toLocaleString() || '0'}</p>
          <p className="text-sm text-gray-500">steps today</p>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          className="h-10 w-10"
          onClick={onIncreaseSteps}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Distance</p>
          <p className="text-lg font-bold">{currentActivity.distance || 0} km</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Calories</p>
          <p className="text-lg font-bold">{currentActivity.calories || 0} kcal</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Time</p>
          <p className="text-lg font-bold">{currentActivity.duration || 0} min</p>
        </div>
      </div>
    </Card>
  );
};

export default ActivityStatsCard;
