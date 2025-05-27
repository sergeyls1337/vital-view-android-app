
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import BottomNavigation from "@/components/BottomNavigation";
import WaterIntakeControl from "@/components/WaterIntakeControl";
import { useWaterData } from "@/hooks/useWaterData";
import { useLanguage } from "@/contexts/LanguageContext";

const WaterPage = () => {
  const { t } = useLanguage();
  const { currentIntake, dailyGoal, addWaterIntake, getTodayEntries, weeklyData } = useWaterData();
  
  const handleWaterIntakeChange = (amount: number) => {
    addWaterIntake(amount);
  };
  
  const todayEntries = getTodayEntries();
  
  return (
    <div className="pb-20 px-6 max-w-lg mx-auto">
      <PageHeader 
        title={t('dashboard.water')} 
        description={t('water.trackHydration')}
      />
      
      <Card className="p-6 mb-6 flex flex-col items-center">
        <WaterIntakeControl 
          onWaterIntakeChange={handleWaterIntakeChange}
          currentIntake={currentIntake}
          dailyGoal={dailyGoal}
        />
      </Card>
      
      <Card className="p-5 mb-6">
        <h3 className="font-medium mb-4">{t('water.todaysLog')}</h3>
        <div className="space-y-3">
          {todayEntries.length > 0 ? (
            todayEntries.map((entry, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-health-blue rounded-full mr-3" />
                  <span>{entry.time}</span>
                </div>
                <span className="font-medium">{entry.amount} ml</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">{t('water.noWaterLogged')}</p>
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
            
            return (
              <div key={item.day} className="flex flex-col items-center">
                <div 
                  className={`w-8 rounded-t-md ${isToday ? 'bg-health-teal' : 'bg-blue-100'}`}
                  style={{ height: `${heightPercent}%` }}
                />
                <p className="text-xs mt-2">{item.day}</p>
                <p className="text-xs text-gray-500">{item.amount > 0 ? (item.amount / 1000).toFixed(1) + 'L' : '-'}</p>
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
