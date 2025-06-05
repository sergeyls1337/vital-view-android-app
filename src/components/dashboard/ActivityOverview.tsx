
import { Activity, Droplets, Moon, TrendingUp, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HealthMetricCard from "@/components/HealthMetricCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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
            <div key={index} className="animate-pulse">
              <Skeleton className="h-24 rounded-xl mb-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "text-emerald-500";
    if (progress >= 80) return "text-green-500";
    if (progress >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressIcon = (progress: number) => {
    if (progress >= 100) return <Target className="h-3 w-3" />;
    if (progress >= 80) return <TrendingUp className="h-3 w-3" />;
    if (progress >= 50) return <Zap className="h-3 w-3" />;
    return null;
  };

  const getProgressBadge = (progress: number, metric: string) => {
    if (progress >= 100) {
      return <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-300">🎯 Goal!</Badge>;
    }
    if (progress >= 80) {
      return <Badge className="text-xs bg-green-100 text-green-700 border-green-300">💪 Great</Badge>;
    }
    if (progress >= 50) {
      return <Badge className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300">⚡ Good</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">📈 Keep going</Badge>;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('dashboard.todaysActivity')}
        </h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div 
          onClick={() => navigate('/activity')} 
          className="cursor-pointer group"
        >
          <div className="transform transition-all duration-300 group-hover:scale-105 group-active:scale-95">
            <HealthMetricCard
              title={t('dashboard.steps')}
              value={currentActivity.steps?.toLocaleString() || "0"}
              icon={<Activity className="h-5 w-5 text-white" />}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
              unit={t('dashboard.steps').toLowerCase()}
              progress={stepsProgress}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className={`flex items-center gap-1 text-xs ${getProgressColor(stepsProgress)}`}>
              {getProgressIcon(stepsProgress)}
              <span>{stepsProgress}% of goal</span>
            </div>
            {getProgressBadge(stepsProgress, 'steps')}
          </div>
        </div>
        
        <div 
          onClick={() => navigate('/activity')} 
          className="cursor-pointer group"
        >
          <div className="transform transition-all duration-300 group-hover:scale-105 group-active:scale-95">
            <HealthMetricCard
              title={t('dashboard.calories')}
              value={currentActivity.calories?.toString() || "0"}
              icon={<Activity className="h-5 w-5 text-white" />}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
              unit="kcal"
              progress={43}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 text-xs text-purple-500">
              <Zap className="h-3 w-3" />
              <span>43% of goal</span>
            </div>
            <Badge variant="secondary" className="text-xs">🔥 Active</Badge>
          </div>
        </div>
        
        <div 
          onClick={() => navigate('/water')} 
          className="cursor-pointer group"
        >
          <div className="transform transition-all duration-300 group-hover:scale-105 group-active:scale-95">
            <HealthMetricCard
              title={t('dashboard.water')}
              value={waterInLiters}
              icon={<Droplets className="h-5 w-5 text-white" />}
              color="bg-gradient-to-br from-cyan-500 to-teal-600"
              unit={t('dashboard.liters')}
              progress={waterProgress}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className={`flex items-center gap-1 text-xs ${getProgressColor(waterProgress)}`}>
              {getProgressIcon(waterProgress)}
              <span>{waterProgress}% of goal</span>
            </div>
            {getProgressBadge(waterProgress, 'water')}
          </div>
        </div>
        
        <div 
          onClick={() => navigate('/sleep')} 
          className="cursor-pointer group"
        >
          <div className="transform transition-all duration-300 group-hover:scale-105 group-active:scale-95">
            <HealthMetricCard
              title={t('dashboard.sleep')}
              value={sleepHours.toString()}
              icon={<Moon className="h-5 w-5 text-white" />}
              color="bg-gradient-to-br from-indigo-500 to-purple-600"
              unit={t('dashboard.hours')}
              progress={sleepProgress}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className={`flex items-center gap-1 text-xs ${getProgressColor(sleepProgress)}`}>
              {getProgressIcon(sleepProgress)}
              <span>{sleepProgress}% of goal</span>
            </div>
            {getProgressBadge(sleepProgress, 'sleep')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityOverview;
