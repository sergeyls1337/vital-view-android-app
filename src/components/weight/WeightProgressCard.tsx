
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, TrendingUp, Target, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WeightProgressCardProps {
  currentWeight: number;
  goalWeight: number;
  weightEntries: any[];
}

const WeightProgressCard = ({ currentWeight, goalWeight, weightEntries }: WeightProgressCardProps) => {
  const { t } = useLanguage();
  
  const weightDifference = currentWeight - goalWeight;
  const isAtGoal = Math.abs(weightDifference) <= 0.5;
  const progressPercentage = Math.max(0, Math.min(100, 100 - (Math.abs(weightDifference) / Math.max(currentWeight, goalWeight) * 100)));
  
  const getWeeklyChange = () => {
    if (weightEntries.length < 2) return 0;
    const weekAgo = weightEntries.length >= 7 ? weightEntries[weightEntries.length - 7] : weightEntries[0];
    return +(currentWeight - weekAgo.weight).toFixed(1);
  };
  
  const weeklyChange = getWeeklyChange();
  
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-gray-800">{t('weight.progress')}</h3>
        <div className="flex items-center space-x-2">
          {isAtGoal ? (
            <Target className="h-5 w-5 text-green-500" />
          ) : weightDifference > 0 ? (
            <TrendingDown className="h-5 w-5 text-orange-500" />
          ) : (
            <TrendingUp className="h-5 w-5 text-blue-500" />
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">{t('weight.progressToGoal')}</span>
            <span className="text-sm font-medium">{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-xs text-gray-500">{t('weight.weeklyChange')}</span>
            </div>
            <p className={`text-lg font-bold ${weeklyChange > 0 ? 'text-red-500' : weeklyChange < 0 ? 'text-green-500' : 'text-gray-600'}`}>
              {weeklyChange > 0 ? '+' : ''}{weeklyChange} kg
            </p>
          </div>
          
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-xs text-gray-500">{t('weight.remaining')}</span>
            </div>
            <p className={`text-lg font-bold ${isAtGoal ? 'text-green-500' : 'text-blue-500'}`}>
              {isAtGoal ? '🎉 Goal!' : `${Math.abs(weightDifference).toFixed(1)} kg`}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeightProgressCard;
