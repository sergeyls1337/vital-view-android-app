
import { Activity, Droplets, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HealthMetricCard from "@/components/HealthMetricCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface ActivityOverviewProps {
  currentActivity: any;
  stepsProgress: number;
  waterInLiters: string;
  waterProgress: number;
  sleepHours: number;
  sleepProgress: number;
}

const ActivityOverview = ({
  currentActivity,
  stepsProgress,
  waterInLiters,
  waterProgress,
  sleepHours,
  sleepProgress
}: ActivityOverviewProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold mb-4">{t('dashboard.todaysActivity')}</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div onClick={() => navigate('/activity')} className="cursor-pointer">
          <HealthMetricCard
            title={t('dashboard.steps')}
            value={currentActivity.steps?.toLocaleString() || "0"}
            icon={<Activity className="h-5 w-5 text-white" />}
            color="bg-health-blue"
            unit={t('dashboard.steps').toLowerCase()}
            progress={stepsProgress}
          />
        </div>
        <div onClick={() => navigate('/activity')} className="cursor-pointer">
          <HealthMetricCard
            title={t('dashboard.calories')}
            value={currentActivity.calories?.toString() || "0"}
            icon={<Activity className="h-5 w-5 text-white" />}
            color="bg-health-purple"
            unit="kcal"
            progress={43}
          />
        </div>
        <div onClick={() => navigate('/water')} className="cursor-pointer">
          <HealthMetricCard
            title={t('dashboard.water')}
            value={waterInLiters}
            icon={<Droplets className="h-5 w-5 text-white" />}
            color="bg-health-teal"
            unit={t('dashboard.liters')}
            progress={waterProgress}
          />
        </div>
        <div onClick={() => navigate('/sleep')} className="cursor-pointer">
          <HealthMetricCard
            title={t('dashboard.sleep')}
            value={sleepHours.toString()}
            icon={<Moon className="h-5 w-5 text-white" />}
            color="bg-health-purple"
            unit={t('dashboard.hours')}
            progress={sleepProgress}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityOverview;
