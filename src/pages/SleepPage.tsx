
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/PageHeader";
import BottomNavigation from "@/components/BottomNavigation";
import SleepQualityChart from "@/components/SleepQualityChart";
import SleepInsightsCard from "@/components/sleep/SleepInsightsCard";
import SleepQualitySelector from "@/components/sleep/SleepQualitySelector";
import SleepGoalCard from "@/components/sleep/SleepGoalCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSleepData } from "@/hooks/useSleepData";
import { useSleepGoal } from "@/hooks/useSleepGoal";
import { Moon, Sunrise, Clock, Calendar, Sparkles } from "lucide-react";

const SleepPage = () => {
  const { t } = useLanguage();
  const { sleepEntries, loading, saveSleepEntry } = useSleepData();
  const { sleepGoal, updateSleepGoal } = useSleepGoal();
  
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [sleepQuality, setSleepQuality] = useState<number>(8);
  const [bedtime, setBedtime] = useState<string>("23:30");
  const [wakeTime, setWakeTime] = useState<string>("07:00");
  
  // Always default to today's date for new entries
  const today = new Date().toISOString().split('T')[0];
  const [sleepDate, setSleepDate] = useState<string>(today);

  // Get chart data from the last 7 entries
  const sleepData = useMemo(() => {
    return sleepEntries
      .slice(0, 7)
      .reverse()
      .map(entry => {
        const date = new Date(entry.date);
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          hours: entry.hours,
          quality: entry.quality
        };
      });
  }, [sleepEntries]);

  const handleLogSleep = async () => {
    const success = await saveSleepEntry({
      date: sleepDate,
      hours: sleepHours,
      quality: sleepQuality,
      bedtime,
      wakeTime,
    });

    if (success) {
      // Reset form to today's date
      setSleepDate(today);
      setSleepHours(7.5);
      setSleepQuality(8);
      setBedtime("23:30");
      setWakeTime("07:00");
    }
  };

  const getAverageSleep = (): number => {
    if (sleepEntries.length === 0) return 0;
    const total = sleepEntries.reduce((sum, entry) => sum + entry.hours, 0);
    return parseFloat((total / sleepEntries.length).toFixed(1));
  };
  
  const getAverageQuality = (): number => {
    if (sleepEntries.length === 0) return 0;
    const total = sleepEntries.reduce((sum, entry) => sum + entry.quality, 0);
    return parseFloat((total / sleepEntries.length).toFixed(1));
  };

  const getBestSleepDay = (): string => {
    if (sleepEntries.length === 0) return t('sleep.na');
    const bestEntry = sleepEntries.reduce((best, entry) => 
      entry.quality > best.quality ? entry : best
    , sleepEntries[0]);
    return new Date(bestEntry.date).toLocaleDateString('en-US', {weekday: 'short'});
  };

  // Get the most recent entry for today or latest entry
  const getTodayEntry = () => {
    const todayEntry = sleepEntries.find(entry => entry.date === today);
    return todayEntry || (sleepEntries.length > 0 ? sleepEntries[0] : null);
  };

  const latestEntry = getTodayEntry() || { 
    hours: 0, 
    quality: 0, 
    bedtime: "00:00", 
    wakeTime: "00:00" 
  };

  if (loading) {
    return (
      <div className="pb-20 px-6 max-w-lg mx-auto">
        <PageHeader 
          title={t('navigation.sleep')} 
          description={t('sleep.description')}
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading sleep data...</div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="pb-20 px-6 max-w-lg mx-auto">
      <PageHeader 
        title={t('navigation.sleep')} 
        description={t('sleep.description')}
      />
      
      {/* Sleep Goal Card */}
      <SleepGoalCard
        currentHours={latestEntry.hours}
        goalHours={sleepGoal}
        onGoalUpdate={updateSleepGoal}
      />

      {/* Sleep Insights */}
      {sleepEntries.length >= 3 && (
        <SleepInsightsCard sleepEntries={sleepEntries} />
      )}
      
      <Card className="p-5 mb-6 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-indigo-900">{t('sleep.lastNightSleep')}</h3>
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <Sparkles className="text-indigo-600 h-4 w-4" />
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-health-purple/20 flex items-center justify-center mr-4">
              <Moon className="text-health-purple h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('sleep.duration')}</p>
              <p className="text-xl font-bold">{latestEntry.hours} {t('dashboard.hours')}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('sleep.quality')}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-5 h-5 ${i < Math.round(latestEntry.quality / 2) ? "text-health-purple" : "text-gray-300"}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-indigo-100 rounded-lg p-3 flex items-center bg-white/60">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <Moon className="text-indigo-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{t('sleep.bedtime')}</p>
              <p className="font-medium">{latestEntry.bedtime}</p>
            </div>
          </div>
          <div className="border border-indigo-100 rounded-lg p-3 flex items-center bg-white/60">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <Sunrise className="text-indigo-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{t('sleep.wakeUp')}</p>
              <p className="font-medium">{latestEntry.wakeTime}</p>
            </div>
          </div>
        </div>
      </Card>
      
      {sleepData.length > 0 && (
        <Card className="p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{t('sleep.weeklyOverview')}</h3>
            <div className="flex items-center text-xs">
              <div className="flex items-center mr-3">
                <div className="w-3 h-3 bg-health-purple rounded-sm mr-1" />
                <span>{t('dashboard.hours')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-health-teal rounded-sm mr-1" />
                <span>{t('sleep.quality')}</span>
              </div>
            </div>
          </div>
          
          <SleepQualityChart data={sleepData} />
        </Card>
      )}
      
      <Card className="p-5 mb-6">
        <h3 className="font-medium mb-4">{t('sleep.statistics')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">{t('sleep.averageDuration')}</p>
            <p className="text-xl font-bold">{getAverageSleep()} {t('sleep.hrs')}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">{t('sleep.averageQuality')}</p>
            <p className="text-xl font-bold">{getAverageQuality()}/10</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">{t('sleep.totalEntries')}</p>
            <p className="text-xl font-bold">{sleepEntries.length}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">{t('sleep.bestSleepDay')}</p>
            <p className="text-xl font-bold">{getBestSleepDay()}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-5 mb-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <h3 className="font-medium mb-4 text-purple-900">{t('sleep.logTonightSleep')}</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="sleepDate">{t('sleep.date')}</Label>
            <div className="flex items-center mt-1">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <Input
                id="sleepDate"
                type="date"
                value={sleepDate}
                onChange={(e) => setSleepDate(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="sleepHours">{t('sleep.sleepDuration')}</Label>
            <div className="flex items-center mt-1">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <Input
                id="sleepHours"
                type="number"
                step="0.1"
                min="0"
                max="24"
                value={sleepHours || ''}
                onChange={(e) => setSleepHours(parseFloat(e.target.value) || 0)}
                className="bg-white"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="sleepQuality">{t('sleep.sleepQuality')}</Label>
            <div className="mt-3">
              <SleepQualitySelector
                value={sleepQuality}
                onChange={setSleepQuality}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bedtime">{t('sleep.bedtime')}</Label>
              <Input
                id="bedtime"
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="mt-1 bg-white"
              />
            </div>
            <div>
              <Label htmlFor="wakeTime">{t('sleep.wakeTime')}</Label>
              <Input
                id="wakeTime"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="mt-1 bg-white"
              />
            </div>
          </div>
          
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform transition-all duration-200 hover:scale-105"
            onClick={handleLogSleep}
          >
            <Moon className="h-4 w-4 mr-2" />
            {t('sleep.saveSleepData')}
          </Button>
        </div>
      </Card>
      
      <BottomNavigation />
    </div>
  );
};

export default SleepPage;
