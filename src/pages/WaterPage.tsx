
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import BottomNavigation from "@/components/BottomNavigation";
import WaterIntakeControl from "@/components/WaterIntakeControl";
import WaterReminderDrawer from "@/components/WaterReminderDrawer";
import { useWaterData } from "@/hooks/useWaterData";
import { useWaterReminder } from "@/hooks/useWaterReminder";
import { useLanguage } from "@/contexts/LanguageContext";
import { BellOff, Clock, Droplets, TrendingUp, Target, Award } from "lucide-react";
import { useEffect, useState } from "react";

const WaterPage = () => {
  const { t } = useLanguage();
  const { currentIntake, dailyGoal, addWaterIntake, getTodayEntries, weeklyData, streak, averageDaily } = useWaterData();
  const { 
    isReminderActive, 
    intervalMinutes, 
    startReminder, 
    stopReminder, 
    requestNotificationPermission,
    getTimeUntilNextReminder
  } = useWaterReminder();

  const [timeUntilNext, setTimeUntilNext] = useState<{ minutes: number; seconds: number } | null>(null);
  
  const handleWaterIntakeChange = (amount: number) => {
    addWaterIntake(amount);
  };

  const handleSetReminder = async (minutes: number) => {
    await requestNotificationPermission();
    startReminder(minutes);
  };

  // Update countdown timer
  useEffect(() => {
    if (!isReminderActive) return;

    const interval = setInterval(() => {
      setTimeUntilNext(getTimeUntilNextReminder());
    }, 1000);

    return () => clearInterval(interval);
  }, [isReminderActive, getTimeUntilNextReminder]);
  
  const todayEntries = getTodayEntries();
  const progress = Math.min(100, (currentIntake / dailyGoal) * 100);
  
  return (
    <div className="pb-20 px-6 max-w-lg mx-auto">
      <PageHeader 
        title={t('dashboard.water')} 
        description={t('water.trackHydration')}
      />
      
      <Card className="p-6 mb-6 flex flex-col items-center bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <WaterIntakeControl 
          onWaterIntakeChange={handleWaterIntakeChange}
          currentIntake={currentIntake}
          dailyGoal={dailyGoal}
        />
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="p-4 text-center">
          <Award className="h-5 w-5 mx-auto mb-2 text-orange-500" />
          <p className="text-xs text-muted-foreground mb-1">Streak</p>
          <p className="text-lg font-bold">{streak}</p>
          <p className="text-xs text-muted-foreground">days</p>
        </Card>
        <Card className="p-4 text-center">
          <TrendingUp className="h-5 w-5 mx-auto mb-2 text-green-500" />
          <p className="text-xs text-muted-foreground mb-1">Average</p>
          <p className="text-lg font-bold">{(averageDaily / 1000).toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">L/day</p>
        </Card>
        <Card className="p-4 text-center">
          <Target className="h-5 w-5 mx-auto mb-2 text-blue-500" />
          <p className="text-xs text-muted-foreground mb-1">Progress</p>
          <p className="text-lg font-bold">{Math.round(progress)}</p>
          <p className="text-xs text-muted-foreground">%</p>
        </Card>
      </div>

      <Card className="p-4 mb-6">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {t('water.reminders')}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            {isReminderActive ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600">
                    {t('water.reminderActive')} ({intervalMinutes} {t('water.minutes')})
                  </span>
                </div>
                {timeUntilNext && (
                  <p className="text-xs text-muted-foreground ml-4">
                    Next in {timeUntilNext.minutes}m {timeUntilNext.seconds}s
                  </p>
                )}
              </div>
            ) : (
              <span className="text-sm text-gray-500">{t('water.noReminder')}</span>
            )}
          </div>
          <div className="flex gap-2">
            {isReminderActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={stopReminder}
                className="flex items-center gap-1"
              >
                <BellOff className="h-3 w-3" />
                {t('water.stopReminder')}
              </Button>
            )}
            <WaterReminderDrawer onSetReminder={handleSetReminder} />
          </div>
        </div>
      </Card>
      
      <Card className="p-5 mb-6">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Droplets className="h-4 w-4" />
          {t('water.todaysLog')}
        </h3>
        <div className="space-y-3">
          {todayEntries.length > 0 ? (
            todayEntries.map((entry, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-health-blue rounded-full mr-3 animate-pulse" />
                  <span className="text-sm">{entry.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{entry.amount}</span>
                  <span className="text-xs text-muted-foreground">ml</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <Droplets className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500 text-sm">{t('water.noWaterLogged')}</p>
            </div>
          )}
        </div>
      </Card>
      
      <Card className="p-5">
        <h3 className="font-medium mb-3">{t('water.weeklyOverview')}</h3>
        <div className="flex justify-between items-end h-40 pt-10">
          {weeklyData.map((item, index) => {
            const heightPercent = Math.min(90, Math.max(10, (item.amount / dailyGoal) * 100));
            const today = new Date().getDay();
            const todayIndex = today === 0 ? 6 : today - 1;
            const isToday = index === todayIndex;
            const isGoalMet = item.amount >= dailyGoal;
            
            return (
              <div key={item.day} className="flex flex-col items-center">
                <div 
                  className={`w-8 rounded-t-md transition-all duration-300 ${
                    isToday 
                      ? 'bg-health-teal shadow-md' 
                      : isGoalMet 
                        ? 'bg-green-400' 
                        : 'bg-blue-200'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <p className={`text-xs mt-2 ${isToday ? 'font-semibold' : ''}`}>{item.day}</p>
                <p className="text-xs text-gray-500">
                  {item.amount > 0 ? (item.amount / 1000).toFixed(1) + 'L' : '-'}
                </p>
                {isGoalMet && (
                  <Target className="h-3 w-3 text-green-500 mt-1" />
                )}
              </div>
            );
          })}
        </div>
      </Card>
      
      <BottomNavigation />
    </div>
  );
};

export default WaterPage;
