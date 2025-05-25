
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Droplets, Moon, Scale } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ActivityRing from "@/components/ActivityRing";
import HealthMetricCard from "@/components/HealthMetricCard";
import BottomNavigation from "@/components/BottomNavigation";
import LoginForm from "@/components/LoginForm";
import { userService } from "@/services/userService";
import { useWaterData } from "@/hooks/useWaterData";
import { useActivityData } from "@/hooks/useActivityData";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(userService.getCurrentUser());
  const { currentIntake, dailyGoal } = useWaterData();
  const { currentActivity, stepsProgress } = useActivityData();
  
  useEffect(() => {
    const currentUser = userService.getCurrentUser();
    setUser(currentUser);
  }, []);
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const waterProgress = Math.min(100, Math.round((currentIntake / dailyGoal) * 100));
  const waterInLiters = (currentIntake / 1000).toFixed(1);

  return (
    <div className="pb-20 max-w-lg mx-auto">
      {/* Header */}
      <div className="p-6 health-gradient text-white rounded-b-3xl mb-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Hello, {user ? user.name : "Guest"}</h1>
            <p className="text-white/90 text-sm">{currentDate}</p>
          </div>
          {user ? (
            <div 
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <span className="text-lg font-bold">{user.name.charAt(0)}</span>
            </div>
          ) : (
            <div 
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <span className="text-lg font-bold">?</span>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <ActivityRing 
            progress={stepsProgress} 
            size={120} 
            color="#ffffff" 
            label="Daily Goal" 
            value={`${stepsProgress}%`} 
          />
          
          <div className="grid grid-cols-2 gap-3">
            <div 
              className="bg-white/20 rounded-xl p-3 flex flex-col items-center cursor-pointer"
              onClick={() => navigate('/activity')}
            >
              <Activity className="h-5 w-5 mb-1" />
              <span className="text-xs">Steps</span>
              <span className="text-lg font-semibold">{currentActivity.steps?.toLocaleString() || '0'}</span>
            </div>
            <div 
              className="bg-white/20 rounded-xl p-3 flex flex-col items-center cursor-pointer"
              onClick={() => navigate('/water')}
            >
              <Droplets className="h-5 w-5 mb-1" />
              <span className="text-xs">Water</span>
              <span className="text-lg font-semibold">{waterInLiters}L</span>
            </div>
            <div 
              className="bg-white/20 rounded-xl p-3 flex flex-col items-center cursor-pointer"
              onClick={() => navigate('/sleep')}
            >
              <Moon className="h-5 w-5 mb-1" />
              <span className="text-xs">Sleep</span>
              <span className="text-lg font-semibold">7.5h</span>
            </div>
            <div 
              className="bg-white/20 rounded-xl p-3 flex flex-col items-center cursor-pointer"
              onClick={() => navigate('/weight')}
            >
              <Scale className="h-5 w-5 mb-1" />
              <span className="text-xs">Weight</span>
              <span className="text-lg font-semibold">75kg</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6">
        {!user && (
          <LoginForm />
        )}
        
        <h2 className="text-xl font-bold mb-4">Today's Activity</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <HealthMetricCard
            title="Steps"
            value={currentActivity.steps?.toLocaleString() || "0"}
            icon={<Activity className="h-5 w-5 text-white" />}
            color="bg-health-blue"
            unit="steps"
            progress={stepsProgress}
          />
          <HealthMetricCard
            title="Calories"
            value={currentActivity.calories?.toString() || "0"}
            icon={<Activity className="h-5 w-5 text-white" />}
            color="bg-health-purple"
            unit="kcal"
            progress={43}
          />
          <HealthMetricCard
            title="Water"
            value={waterInLiters}
            icon={<Droplets className="h-5 w-5 text-white" />}
            color="bg-health-teal"
            unit="liters"
            progress={waterProgress}
          />
          <HealthMetricCard
            title="Sleep"
            value="7.5"
            icon={<Moon className="h-5 w-5 text-white" />}
            color="bg-health-purple"
            unit="hours"
            progress={94}
          />
        </div>
        
        <Card className="p-5 mb-6">
          <h3 className="font-medium mb-2">Weight Tracking</h3>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-500">Current</p>
              <p className="text-xl font-bold">75 kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Goal</p>
              <p className="text-xl font-bold text-health-green">70 kg</p>
            </div>
            <Button 
              className="bg-health-blue hover:bg-health-teal text-xs h-9"
              onClick={() => navigate('/weight')}
            >
              Track Weight
            </Button>
          </div>
        </Card>
        
        <Card className="p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Today's Tips</h3>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="min-w-5 min-h-5 rounded-full bg-health-green mt-1"></div>
              <p className="text-sm">Try to drink 2 more glasses of water before dinner</p>
            </li>
            <li className="flex items-start gap-2">
              <div className="min-w-5 min-h-5 rounded-full bg-health-blue mt-1"></div>
              <p className="text-sm">You're {Math.max(0, 10000 - (currentActivity.steps || 0)).toLocaleString()} steps away from your daily goal</p>
            </li>
            <li className="flex items-start gap-2">
              <div className="min-w-5 min-h-5 rounded-full bg-health-teal mt-1"></div>
              <p className="text-sm">Try to get 8 hours of sleep tonight</p>
            </li>
          </ul>
        </Card>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
