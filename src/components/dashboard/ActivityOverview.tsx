
import { Activity, Droplets, Moon, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HealthMetricCard from "@/components/HealthMetricCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityOverviewProps {
  currentActivity: any;
  stepsProgress: number;
  waterInLiters: string;
  waterProgress: number;
  sleepHours: number;
  sleepProgress: number;
  isLoading?: boolean;
}

const ActivityOverview = ({
  currentActivity,
  stepsProgress,
  waterInLiters,
  waterProgress,
  sleepHours,
  sleepProgress,
  isLoading = false
}: ActivityOverviewProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-500";
    if (progress >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressIcon = (progress: number) => {
    if (progress >= 80) return <TrendingUp className="h-3 w-3" />;
    return null;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{t('dashboard.todaysActivity')}</h2>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div 
          onClick={() => navigate('/activity')} 
          className="cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <HealthMetricCard
            title={t('dashboard.steps')}
            value={currentActivity.steps?.toLocaleString() || "0"}
            icon={<Activity className="h-5 w-5 text-white" />}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            unit={t('dashboard.steps').toLowerCase()}
            progress={stepsProgress}
          />
          <div className={`flex items-center gap-1 mt-1 text-xs ${getProgressColor(stepsProgress)}`}>
            {getProgressIcon(stepsProgress)}
            <span>{stepsProgress}% of goal</span>
          </div>
        </div>
        
        <div 
          onClick={() => navigate('/activity')} 
          className="cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <HealthMetricCard
            title={t('dashboard.calories')}
            value={currentActivity.calories?.toString() || "0"}
            icon={<Activity className="h-5 w-5 text-white" />}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            unit="kcal"
            progress={43}
          />
          <div className="flex items-center gap-1 mt-1 text-xs text-purple-500">
            <span>43% of goal</span>
          </div>
        </div>
        
        <div 
          onClick={() => navigate('/water')} 
          className="cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <HealthMetricCard
            title={t('dashboard.water')}
            value={waterInLiters}
            icon={<Droplets className="h-5 w-5 text-white" />}
            color="bg-gradient-to-br from-cyan-500 to-teal-600"
            unit={t('dashboard.liters')}
            progress={waterProgress}
          />
          <div className={`flex items-center gap-1 mt-1 text-xs ${getProgressColor(waterProgress)}`}>
            {getProgressIcon(waterProgress)}
            <span>{waterProgress}% of goal</span>
          </div>
        </div>
        
        <div 
          onClick={() => navigate('/sleep')} 
          className="cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <HealthMetricCard
            title={t('dashboard.sleep')}
            value={sleepHours.toString()}
            icon={<Moon className="h-5 w-5 text-white" />}
            color="bg-gradient-to-br from-indigo-500 to-purple-600"
            unit={t('dashboard.hours')}
            progress={sleepProgress}
          />
          <div className={`flex items-center gap-1 mt-1 text-xs ${getProgressColor(sleepProgress)}`}>
            {getProgressIcon(sleepProgress)}
            <span>{sleepProgress}% of goal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityOverview;
