
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 bg-gradient-to-br from-health-blue via-health-purple to-health-teal text-white rounded-b-3xl mb-6 shadow-xl animate-fade-in relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium">{getGreeting()}</p>
          <h1 className="text-2xl font-bold mb-1">
            {userProfile?.name || user?.email?.split('@')[0] || "User"}
          </h1>
          <p className="text-white/90 text-sm">{currentDate}</p>
        </div>
        <div className="flex space-x-3">
          <div 
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all duration-300 hover:scale-110 active:scale-95"
            onClick={onSettingsClick}
          >
            <Settings className="h-5 w-5" />
          </div>
          <div 
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all duration-300 hover:scale-110 active:scale-95"
            onClick={() => navigate("/profile")}
          >
            <span className="text-lg font-bold">
              {(userProfile?.name || user?.email || "U").charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between items-center relative z-10">
        <div className="relative">
          <ActivityRing 
            progress={stepsProgress} 
            size={120} 
            color="#ffffff" 
            label={t('dashboard.dailyGoal')} 
            value={`${stepsProgress}%`} 
          />
          <div className="absolute inset-0 rounded-full bg-white/5 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div 
            className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center cursor-pointer hover:bg-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/10"
            onClick={() => navigate('/activity')}
          >
            <span className="text-xs font-medium opacity-90">{t('dashboard.steps')}</span>
            <span className="text-lg font-bold">{currentActivity.steps?.toLocaleString() || '0'}</span>
          </div>
          <div 
            className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center cursor-pointer hover:bg-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/10"
            onClick={() => navigate('/water')}
          >
            <span className="text-xs font-medium opacity-90">{t('dashboard.water')}</span>
            <span className="text-lg font-bold">{waterInLiters}L</span>
          </div>
          <div 
            className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center cursor-pointer hover:bg-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/10"
            onClick={() => navigate('/sleep')}
          >
            <span className="text-xs font-medium opacity-90">{t('dashboard.sleep')}</span>
            <span className="text-lg font-bold">{sleepHours}h</span>
          </div>
          <div 
            className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center cursor-pointer hover:bg-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/10"
            onClick={() => navigate('/weight')}
          >
            <span className="text-xs font-medium opacity-90">{t('dashboard.weight')}</span>
            <span className="text-lg font-bold">{currentWeight || 0}kg</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
