
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import BottomNavigation from "@/components/BottomNavigation";
import SleepQualityChart from "@/components/SleepQualityChart";
import { useLanguage } from "@/contexts/LanguageContext";
import { Moon, Sunrise, Clock, Calendar } from "lucide-react";

interface SleepEntry {
  id: string;
  date: string;
  hours: number;
  quality: number;
  bedtime: string;
  wakeTime: string;
}

const SleepPage = () => {
  const { t } = useLanguage();
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [sleepQuality, setSleepQuality] = useState<number>(8);
  const [bedtime, setBedtime] = useState<string>("23:30");
  const [wakeTime, setWakeTime] = useState<string>("07:00");
  const [sleepDate, setSleepDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [sleepData, setSleepData] = useState<Array<{day: string, hours: number, quality: number}>>([]);
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);

  // Load sleep data from local storage when component mounts
  useEffect(() => {
    const storedEntries = localStorage.getItem("sleepEntries");
    if (storedEntries) {
      const entries = JSON.parse(storedEntries) as SleepEntry[];
      setSleepEntries(entries);
      
      // Convert the last 7 entries to chart data format
      const chartData = entries
        .slice(-7)
        .map(entry => {
          const date = new Date(entry.date);
          return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            hours: entry.hours,
            quality: entry.quality
          };
        });
      
      setSleepData(chartData);
      
      // Set form values from the latest entry if it exists
      if (entries.length > 0) {
        const latestEntry = entries[entries.length - 1];
        setSleepHours(latestEntry.hours);
        setSleepQuality(latestEntry.quality);
        setBedtime(latestEntry.bedtime);
        setWakeTime(latestEntry.wakeTime);
      }
    } else {
      // Fallback to demo data if no entries exist
      setSleepData([
        { day: "Mon", hours: 7.5, quality: 8 },
        { day: "Tue", hours: 6.2, quality: 6 },
        { day: "Wed", hours: 8.0, quality: 9 },
        { day: "Thu", hours: 7.0, quality: 7 },
        { day: "Fri", hours: 6.5, quality: 6 },
        { day: "Sat", hours: 9.0, quality: 9 },
        { day: "Sun", hours: 8.0, quality: 8 },
      ]);
    }
  }, []);

  const handleLogSleep = () => {
    // Create a new sleep entry
    const newEntry: SleepEntry = {
      id: Date.now().toString(),
      date: sleepDate,
      hours: sleepHours,
      quality: sleepQuality,
      bedtime,
      wakeTime,
    };

    // Add the new entry to the existing entries
    const updatedEntries = [...sleepEntries, newEntry];
    
    // Sort entries by date
    updatedEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Update state
    setSleepEntries(updatedEntries);
    
    // Save to localStorage
    localStorage.setItem("sleepEntries", JSON.stringify(updatedEntries));
    
    // Update chart data with the last 7 entries
    const chartData = updatedEntries
      .slice(-7)
      .map(entry => {
        const date = new Date(entry.date);
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          hours: entry.hours,
          quality: entry.quality
        };
      });
    
    setSleepData(chartData);
    toast.success(t('sleep.dataSaved'));
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

  // Get the most recent entry
  const latestEntry = sleepEntries.length > 0 
    ? sleepEntries[sleepEntries.length - 1] 
    : { hours: 7.5, quality: 4, bedtime: "23:30", wakeTime: "07:00" };

  return (
    <div className="pb-20 px-6 max-w-lg mx-auto">
      <PageHeader 
        title={t('navigation.sleep')} 
        description={t('sleep.description')}
      />
      
      <Card className="p-5 mb-6">
        <h3 className="font-medium mb-4">{t('sleep.lastNightSleep')}</h3>
        
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
          <div className="border border-gray-100 rounded-lg p-3 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <Moon className="text-gray-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{t('sleep.bedtime')}</p>
              <p className="font-medium">{latestEntry.bedtime}</p>
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg p-3 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <Sunrise className="text-gray-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{t('sleep.wakeUp')}</p>
              <p className="font-medium">{latestEntry.wakeTime}</p>
            </div>
          </div>
        </div>
      </Card>
      
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
      
      <Card className="p-5 mb-6">
        <h3 className="font-medium mb-4">{t('sleep.logTonightSleep')}</h3>
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
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="sleepQuality">{t('sleep.sleepQuality')}</Label>
            <Input
              id="sleepQuality"
              type="range"
              min="1"
              max="10"
              step="1"
              value={sleepQuality}
              onChange={(e) => setSleepQuality(parseInt(e.target.value))}
              className="mt-1"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{t('sleep.poor')}</span>
              <span>{t('sleep.average')}</span>
              <span>{t('sleep.excellent')}</span>
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
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="wakeTime">{t('sleep.wakeTime')}</Label>
              <Input
                id="wakeTime"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <Button
            className="w-full bg-health-purple hover:bg-purple-600"
            onClick={handleLogSleep}
          >
            {t('sleep.saveSleepData')}
          </Button>
        </div>
      </Card>
      
      <BottomNavigation />
    </div>
  );
};

export default SleepPage;
