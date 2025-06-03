
import { Activity, Plus, Minus, TrendingUp, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Settings } from "lucide-react";
import ActivityRing from "@/components/ActivityRing";
import { DailyActivity } from "@/types/activity";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

  const getProgressColor = () => {
    if (stepsProgress >= 100) return "#10b981"; // green
    if (stepsProgress >= 75) return "#f59e0b"; // amber
    if (stepsProgress >= 50) return "#3b82f6"; // blue
    return "#6b7280"; // gray
  };

  const getProgressIcon = () => {
    if (stepsProgress >= 100) return <Target className="h-4 w-4 text-green-500" />;
    return <TrendingUp className="h-4 w-4 text-health-blue" />;
  };

  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-background to-background/50 border-l-4 border-l-health-blue">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-lg">{t('activity.todaysProgress')}</h3>
          {getProgressIcon()}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Goal: {stepsGoal.toLocaleString()}
          </span>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 hover:bg-health-blue/10"
            onClick={onOpenAddDialog}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 hover:bg-health-blue/10"
            onClick={onOpenGoalDialog}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center mb-8">
        <div className="relative">
          <ActivityRing
            progress={stepsProgress}
            size={200}
            strokeWidth={16}
            color={getProgressColor()}
            label="Steps"
            value={currentActivity.steps?.toLocaleString() || '0'}
          />
          {stepsProgress >= 100 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-ping" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mb-6">
        <Button 
          variant="outline" 
          size="icon"
          className="h-12 w-12 hover:bg-health-blue/10 hover:border-health-blue transition-all duration-300"
          onClick={onDecreaseSteps}
        >
          <Minus className="h-5 w-5" />
        </Button>
        <div className="text-center px-4">
          <p className="text-3xl font-bold text-foreground mb-1">
            {currentActivity.steps?.toLocaleString() || '0'}
          </p>
          <p className="text-sm text-muted-foreground">Steps today</p>
          <div className="mt-2 px-3 py-1 bg-health-blue/10 rounded-full">
            <p className="text-xs font-medium text-health-blue">
              {stepsProgress}% complete
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          className="h-12 w-12 hover:bg-health-blue/10 hover:border-health-blue transition-all duration-300"
          onClick={onIncreaseSteps}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 rounded-lg bg-muted/30">
          <p className="text-xs text-muted-foreground mb-1">Distance</p>
          <p className="text-lg font-bold text-foreground">{currentActivity.distance || 0}</p>
          <p className="text-xs text-muted-foreground">km</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/30">
          <p className="text-xs text-muted-foreground mb-1">Calories</p>
          <p className="text-lg font-bold text-foreground">{currentActivity.calories || 0}</p>
          <p className="text-xs text-muted-foreground">kcal</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/30">
          <p className="text-xs text-muted-foreground mb-1">Time</p>
          <p className="text-lg font-bold text-foreground">{currentActivity.duration || 0}</p>
          <p className="text-xs text-muted-foreground">min</p>
        </div>
      </div>
    </Card>
  );
};

export default ActivityStatsCard;
