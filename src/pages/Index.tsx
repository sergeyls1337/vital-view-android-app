import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Droplets, Moon, Scale, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ActivityRing from "@/components/ActivityRing";
import HealthMetricCard from "@/components/HealthMetricCard";
import BottomNavigation from "@/components/BottomNavigation";
import SettingsPanel from "@/components/SettingsPanel";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { userService } from "@/services/userService";
import { useWaterData } from "@/hooks/useWaterData";
import { useActivityData } from "@/hooks/useActivityData";
import { useSleepData } from "@/hooks/useSleepData";
import { useHealthTips } from "@/hooks/useHealthTips";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [userProfile, setUserProfile] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const { currentIntake, dailyGoal } = useWaterData();
  const { currentActivity, stepsProgress } = useActivityData();
  const { sleepEntries } = useSleepData();
  
  // Get weight data from localStorage (same as WeightPage)
  const [weightData, setWeightData] = useState([]);
  
  useEffect(() => {
    if (user) {
      userService.getCurrentUser().then(setUserProfile);
    }
  }, [user]);

  useEffect(() => {
    const savedWeightData = localStorage.getItem("weightData");
    if (savedWeightData) {
      setWeightData(JSON.parse(savedWeightData));
    }
  }, []);
  
  const currentDate = new Date().toLocaleDateString(undefined, { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const waterProgress = Math.min(100, Math.round((currentIntake / dailyGoal) * 100));
  const waterInLiters = (currentIntake / 1000).toFixed(1);

  // Get latest sleep data
  const latestSleepEntry = sleepEntries.length > 0 ? sleepEntries[0] : null;
  const sleepHours = latestSleepEntry ? latestSleepEntry.hours : 0;
  const sleepProgress = latestSleepEntry ? Math.min(100, Math.round((latestSleepEntry.hours / 8) * 100)) : 0;

  // Get current weight
  const getCurrentWeight = () => {
    return weightData.length > 0 ? weightData[weightData.length - 1].weight : 0;
  };

  const currentWeight = getCurrentWeight();
  const goalWeight = 70;

  const healthTips = useHealthTips(weightData);

  return (
    <div className="pb-20 max-w-lg mx-auto">
      {/* Header */}
      <div className="p-6 health-gradient text-white rounded-b-3xl mb-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {t('dashboard.hello')}, {userProfile?.name || user?.email?.split('@')[0] || "User"}
            </h1>
            <p className="text-white/90 text-sm">{currentDate}</p>
          </div>
          <div className="flex space-x-2">
            <div 
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-5 w-5" />
            </div>
            <div 
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center cursor-pointer"
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
              className="bg-white/20 rounded-xl p-3 flex flex-col items-center cursor-pointer"
              onClick={() => navigate('/activity')}
            >
              <Activity className="h-5 w-5 mb-1" />
              <span className="text-xs">{t('dashboard.steps')}</span>
              <span className="text-lg font-semibold">{currentActivity.steps?.toLocaleString() || '0'}</span>
            </div>
            <div 
              className="bg-white/20 rounded-xl p-3 flex flex-col items-center cursor-pointer"
              onClick={() => navigate('/water')}
            >
              <Droplets className="h-5 w-5 mb-1" />
              <span className="text-xs">{t('dashboard.water')}</span>
              <span className="text-lg font-semibold">{waterInLiters}L</span>
            </div>
            <div 
              className="bg-white/20 rounded-xl p-3 flex flex-col items-center cursor-pointer"
              onClick={() => navigate('/sleep')}
            >
              <Moon className="h-5 w-5 mb-1" />
              <span className="text-xs">{t('dashboard.sleep')}</span>
              <span className="text-lg font-semibold">{sleepHours}h</span>
            </div>
            <div 
              className="bg-white/20 rounded-xl p-3 flex flex-col items-center cursor-pointer"
              onClick={() => navigate('/weight')}
            >
              <Scale className="h-5 w-5 mb-1" />
              <span className="text-xs">{t('dashboard.weight')}</span>
              <span className="text-lg font-semibold">{currentWeight || 0}kg</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6">
        <h2 className="text-xl font-bold mb-4">{t('dashboard.todaysActivity')}</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <HealthMetricCard
            title={t('dashboard.steps')}
            value={currentActivity.steps?.toLocaleString() || "0"}
            icon={<Activity className="h-5 w-5 text-white" />}
            color="bg-health-blue"
            unit={t('dashboard.steps').toLowerCase()}
            progress={stepsProgress}
          />
          <HealthMetricCard
            title={t('dashboard.calories')}
            value={currentActivity.calories?.toString() || "0"}
            icon={<Activity className="h-5 w-5 text-white" />}
            color="bg-health-purple"
            unit="kcal"
            progress={43}
          />
          <HealthMetricCard
            title={t('dashboard.water')}
            value={waterInLiters}
            icon={<Droplets className="h-5 w-5 text-white" />}
            color="bg-health-teal"
            unit={t('dashboard.liters')}
            progress={waterProgress}
          />
          <HealthMetricCard
            title={t('dashboard.sleep')}
            value={sleepHours.toString()}
            icon={<Moon className="h-5 w-5 text-white" />}
            color="bg-health-purple"
            unit={t('dashboard.hours')}
            progress={sleepProgress}
          />
        </div>
        
        <Card className="p-5 mb-6">
          <h3 className="font-medium mb-2">{t('dashboard.weight')} {t('navigation.weight')}</h3>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-500">{t('dashboard.current')}</p>
              <p className="text-xl font-bold">{currentWeight || 0} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('dashboard.goal')}</p>
              <p className="text-xl font-bold text-health-green">{goalWeight} kg</p>
            </div>
            <Button 
              className="bg-health-blue hover:bg-health-teal text-xs h-9"
              onClick={() => navigate('/weight')}
            >
              {t('dashboard.trackWeight')}
            </Button>
          </div>
        </Card>
        
        <Card className="p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">{t('dashboard.todaysTips')}</h3>
          </div>
          <ul className="space-y-2">
            {healthTips.map((tip) => (
              <li key={tip.id} className="flex items-start gap-2">
                <div className={`min-w-5 min-h-5 rounded-full ${tip.color} mt-1`}></div>
                <p className="text-sm">{tip.text}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      
      <BottomNavigation />
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default Index;
