
import { useState, useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import SettingsPanel from "@/components/SettingsPanel";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ActivityOverview from "@/components/dashboard/ActivityOverview";
import WeightTrackingCard from "@/components/dashboard/WeightTrackingCard";
import HealthTipsCard from "@/components/dashboard/HealthTipsCard";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/userService";
import { useWaterData } from "@/hooks/useWaterData";
import { useActivityData } from "@/hooks/useActivityData";
import { useSleepData } from "@/hooks/useSleepData";
import { useHealthTips } from "@/hooks/useHealthTips";

const Index = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentIntake, dailyGoal } = useWaterData();
  const { currentActivity, stepsProgress } = useActivityData();
  const { sleepEntries } = useSleepData();
  
  // Get weight data from localStorage (same as WeightPage)
  const [weightData, setWeightData] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          const profile = await userService.getCurrentUser();
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
      
      // Simulate loading time for better UX
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    
    loadData();
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
    <div className="pb-20 max-w-lg mx-auto min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <DashboardHeader
        userProfile={userProfile}
        user={user}
        currentDate={currentDate}
        stepsProgress={stepsProgress}
        currentActivity={currentActivity}
        waterInLiters={waterInLiters}
        sleepHours={sleepHours}
        currentWeight={currentWeight}
        onSettingsClick={() => setShowSettings(true)}
      />
      
      <div className="px-6 space-y-6">
        <ActivityOverview
          currentActivity={currentActivity}
          stepsProgress={stepsProgress}
          waterInLiters={waterInLiters}
          waterProgress={waterProgress}
          sleepHours={sleepHours}
          sleepProgress={sleepProgress}
          isLoading={isLoading}
        />
        
        <WeightTrackingCard
          currentWeight={currentWeight}
          goalWeight={goalWeight}
        />
        
        <HealthTipsCard healthTips={healthTips} />
      </div>
      
      <BottomNavigation />
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default Index;
