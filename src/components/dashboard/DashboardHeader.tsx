
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ActivityRing from "@/components/ActivityRing";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardHeaderProps {
  userProfile: any;
  user: any;
  currentDate: string;
  stepsProgress: number;
  currentActivity: any;
  waterInLiters: string;
  sleepHours: number;
  currentWeight: number;
  onSettingsClick: () => void;
}

const DashboardHeader = ({
  userProfile,
  user,
  currentDate,
  stepsProgress,
  currentActivity,
  waterInLiters,
  sleepHours,
  currentWeight,
  onSettingsClick
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="p-6 health-gradient text-white rounded-b-3xl mb-6 shadow-lg animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {t('dashboard.hello')}, {userProfile?.name || user?.email?.split('@')[0] || "User"}
          </h1>
          <p className="text-white/90 text-sm">{currentDate}</p>
        </div>
        <div className="flex space-x-2">
          <div 
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
            onClick={onSettingsClick}
          >
            <Settings className="h-5 w-5" />
          </div>
          <div 
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
            onClick={() => navigate("/profile")}
          >
            <span className="text-lg font-bold">
              {(userProfile?.name || user?.email || "U").charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <ActivityRing 
          progress={stepsProgress} 
          size={120} 
          color="#ffffff" 
          label={t('dashboard.dailyGoal')} 
          value={`${stepsProgress}%`} 
        />
        
        <div className="grid grid-cols-2 gap-3">
          <div 
            className="bg-white/20 rounded-xl p-3 flex flex-col items-center cursor-pointer hover:bg-white/30 transition-colors hover-scale"
            onClick={() => navigate('/activity')}
          >
            <span className="text-xs">{t('dashboard.steps')}</span>
            <span className="text-lg font-semibold">{currentActivity.steps?.toLocaleString() || '0'}</span>
          </div>
          <div 
            className="bg-white/20 rounded-xl p-3 flex flex-col items-center cursor-pointer hover:bg-white/30 transition-colors hover-scale"
            onClick={() => navigate('/water')}
          >
            <span className="text-xs">{t('dashboard.water')}</span>
            <span className="text-lg font-semibold">{waterInLiters}L</span>
          </div>
          <div 
            className="bg-white/20 rounded-xl p-3 flex flex-col items-center cursor-pointer hover:bg-white/30 transition-colors hover-scale"
            onClick={() => navigate('/sleep')}
          >
            <span className="text-xs">{t('dashboard.sleep')}</span>
            <span className="text-lg font-semibold">{sleepHours}h</span>
          </div>
          <div 
            className="bg-white/20 rounded-xl p-3 flex flex-col items-center cursor-pointer hover:bg-white/30 transition-colors hover-scale"
            onClick={() => navigate('/weight')}
          >
            <span className="text-xs">{t('dashboard.weight')}</span>
            <span className="text-lg font-semibold">{currentWeight || 0}kg</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
