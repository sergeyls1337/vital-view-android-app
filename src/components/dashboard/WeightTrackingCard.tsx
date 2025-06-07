
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown, Target } from "lucide-react";

interface WeightTrackingCardProps {
  currentWeight: number;
  goalWeight: number;
}

const WeightTrackingCard = ({ currentWeight, goalWeight }: WeightTrackingCardProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const weightDifference = currentWeight - goalWeight;
  const isAtGoal = Math.abs(weightDifference) <= 1;
  const isAboveGoal = currentWeight > goalWeight;

  const getTrendIcon = () => {
    if (isAtGoal) return <Target className="h-4 w-4 text-green-500" />;
    if (isAboveGoal) return <TrendingDown className="h-4 w-4 text-orange-500" />;
    return <TrendingUp className="h-4 w-4 text-blue-500" />;
  };

  const getProgressPercentage = () => {
    if (isAtGoal) return 100;
    // Calculate progress based on how close we are to the goal
    // If we're above goal, progress is based on how much we need to lose
    // If we're below goal, progress is based on how much we need to gain
    const progress = Math.max(0, 100 - (Math.abs(weightDifference) / goalWeight) * 100);
    return Math.round(progress);
  };

  return (
    <Card className="p-6 mb-6 hover-scale transition-all duration-300 border-l-4 border-l-health-blue bg-gradient-to-r from-background to-background/50">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-medium text-lg">{t('dashboard.weight')} {t('navigation.weight')}</h3>
        {getTrendIcon()}
      </div>
      
      <div className="flex justify-between items-end mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{t('dashboard.current')}</p>
          <p className="text-2xl font-bold text-foreground">{currentWeight || 0} kg</p>
          {!isAtGoal && (
            <div className="flex items-center gap-1 mt-2">
              <div className={`w-2 h-2 rounded-full ${isAboveGoal ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
              <p className={`text-xs ${isAboveGoal ? 'text-orange-600' : 'text-blue-600'}`}>
                {Math.abs(weightDifference).toFixed(1)}kg {isAboveGoal ? 'above' : 'to'} goal
              </p>
            </div>
          )}
        </div>
        
        <div className="flex-1 text-center">
          <p className="text-sm text-muted-foreground mb-1">{t('dashboard.goal')}</p>
          <p className={`text-2xl font-bold ${isAtGoal ? 'text-green-600' : 'text-muted-foreground'}`}>
            {goalWeight} kg
          </p>
          {isAtGoal && (
            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="text-xs text-green-600 font-medium">Goal achieved! 🎉</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 flex justify-end">
          <Button 
            className="bg-gradient-to-r from-health-blue to-health-teal hover:from-health-teal hover:to-health-blue text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            onClick={() => navigate('/weight')}
          >
            {t('dashboard.trackWeight')}
          </Button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            isAtGoal ? 'bg-green-500' : isAboveGoal ? 'bg-orange-500' : 'bg-blue-500'
          }`}
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        {getProgressPercentage()}% progress to goal
      </p>
    </Card>
  );
};

export default WeightTrackingCard;
