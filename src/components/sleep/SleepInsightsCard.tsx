
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

interface SleepEntry {
  id: string;
  date: string;
  hours: number;
  quality: number;
  bedtime: string;
  wakeTime: string;
}

interface SleepInsightsCardProps {
  sleepEntries: SleepEntry[];
}

const SleepInsightsCard = ({ sleepEntries }: SleepInsightsCardProps) => {
  const { t } = useLanguage();

  const getLastWeekEntries = () => {
    return sleepEntries.slice(0, 7);
  };

  const getConsistencyScore = () => {
    const lastWeek = getLastWeekEntries();
    if (lastWeek.length < 3) return 0;
    
    const avgHours = lastWeek.reduce((sum, entry) => sum + entry.hours, 0) / lastWeek.length;
    const variance = lastWeek.reduce((sum, entry) => sum + Math.pow(entry.hours - avgHours, 2), 0) / lastWeek.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower standard deviation = higher consistency (scale 0-100)
    return Math.max(0, Math.min(100, 100 - (stdDev * 20)));
  };

  const getSleepTrend = () => {
    if (sleepEntries.length < 2) return { direction: 'stable', change: 0 };
    
    const recent = sleepEntries.slice(0, 3);
    const previous = sleepEntries.slice(3, 6);
    
    if (recent.length === 0 || previous.length === 0) return { direction: 'stable', change: 0 };
    
    const recentAvg = recent.reduce((sum, entry) => sum + entry.hours, 0) / recent.length;
    const previousAvg = previous.reduce((sum, entry) => sum + entry.hours, 0) / previous.length;
    
    const change = recentAvg - previousAvg;
    
    if (Math.abs(change) < 0.2) return { direction: 'stable', change: 0 };
    return { direction: change > 0 ? 'up' : 'down', change: Math.abs(change) };
  };

  const getOptimalBedtime = () => {
    if (sleepEntries.length < 3) return null;
    
    const bestEntries = sleepEntries
      .filter(entry => entry.quality >= 8)
      .slice(0, 5);
    
    if (bestEntries.length === 0) return null;
    
    const avgBedtime = bestEntries.reduce((sum, entry) => {
      const [hours, minutes] = entry.bedtime.split(':').map(Number);
      return sum + (hours * 60 + minutes);
    }, 0) / bestEntries.length;
    
    const hours = Math.floor(avgBedtime / 60);
    const minutes = Math.round(avgBedtime % 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const consistencyScore = getConsistencyScore();
  const trend = getSleepTrend();
  const optimalBedtime = getOptimalBedtime();

  return (
    <Card className="p-5 mb-6 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-purple-900">Sleep Insights</h3>
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <AlertCircle className="h-4 w-4 text-purple-600" />
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Consistency Score */}
        <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className={`h-4 w-4 ${consistencyScore >= 70 ? 'text-green-500' : 'text-orange-500'}`} />
            <span className="text-sm font-medium">Sleep Consistency</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold">{Math.round(consistencyScore)}%</span>
            <p className="text-xs text-gray-500">
              {consistencyScore >= 80 ? 'Excellent' : consistencyScore >= 60 ? 'Good' : 'Needs improvement'}
            </p>
          </div>
        </div>

        {/* Sleep Trend */}
        <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
          <div className="flex items-center space-x-2">
            {trend.direction === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : trend.direction === 'down' ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <div className="w-4 h-4 rounded-full bg-gray-400" />
            )}
            <span className="text-sm font-medium">Recent Trend</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold">
              {trend.direction === 'up' && `+${trend.change.toFixed(1)}h`}
              {trend.direction === 'down' && `-${trend.change.toFixed(1)}h`}
              {trend.direction === 'stable' && 'Stable'}
            </span>
            <p className="text-xs text-gray-500">vs last week</p>
          </div>
        </div>

        {/* Optimal Bedtime */}
        {optimalBedtime && (
          <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-purple-400" />
              <span className="text-sm font-medium">Optimal Bedtime</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold">{optimalBedtime}</span>
              <p className="text-xs text-gray-500">based on best nights</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SleepInsightsCard;
