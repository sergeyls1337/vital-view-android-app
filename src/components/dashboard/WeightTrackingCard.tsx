
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface WeightTrackingCardProps {
  currentWeight: number;
  goalWeight: number;
}

const WeightTrackingCard = ({ currentWeight, goalWeight }: WeightTrackingCardProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const weightDifference = Math.abs(currentWeight - goalWeight);
  const isAtGoal = weightDifference <= 1;

  return (
    <Card className="p-5 mb-6 hover-scale transition-all duration-200">
      <h3 className="font-medium mb-2">{t('dashboard.weight')} {t('navigation.weight')}</h3>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-gray-500">{t('dashboard.current')}</p>
          <p className="text-xl font-bold">{currentWeight || 0} kg</p>
          {!isAtGoal && (
            <p className="text-xs text-orange-600">
              {currentWeight > goalWeight ? '-' : '+'}{weightDifference.toFixed(1)}kg to goal
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-500">{t('dashboard.goal')}</p>
          <p className={`text-xl font-bold ${isAtGoal ? 'text-health-green' : 'text-health-orange'}`}>
            {goalWeight} kg
          </p>
          {isAtGoal && (
            <p className="text-xs text-green-600">Goal achieved! 🎉</p>
          )}
        </div>
        <Button 
          className="bg-health-blue hover:bg-health-teal text-xs h-9 hover-scale"
          onClick={() => navigate('/weight')}
        >
          {t('dashboard.trackWeight')}
        </Button>
      </div>
    </Card>
  );
};

export default WeightTrackingCard;
