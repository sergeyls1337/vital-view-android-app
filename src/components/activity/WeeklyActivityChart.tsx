
import { Card } from "@/components/ui/card";

interface WeeklyChartItem {
  day: string;
  steps: number;
  heightPercent: number;
  isToday: boolean;
}

interface WeeklyActivityChartProps {
  weeklyActivities: WeeklyChartItem[];
}

const WeeklyActivityChart = ({ weeklyActivities }: WeeklyActivityChartProps) => {
  const maxSteps = Math.max(...weeklyActivities.map(item => item.steps));
  
  return (
    <Card className="p-5 mb-6">
      <h3 className="font-medium mb-3">Weekly Activity</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-end h-40 pt-4 px-2">
          {weeklyActivities.map((item) => {
            const heightPercent = maxSteps > 0 ? Math.max(8, (item.steps / maxSteps) * 100) : 8;
            
            return (
              <div key={item.day} className="flex flex-col items-center flex-1 mx-1">
                <div className="relative w-full flex justify-center">
                  <div 
                    className={`w-6 rounded-t-md transition-all duration-300 ${
                      item.isToday 
                        ? 'bg-health-blue shadow-lg' 
                        : item.steps > 0 
                          ? 'bg-health-blue/60' 
                          : 'bg-gray-200'
                    }`}
                    style={{ height: `${heightPercent}%`, minHeight: '8px' }}
                  />
                  {item.isToday && (
                    <div className="absolute -top-1 w-2 h-2 bg-health-blue rounded-full animate-pulse" />
                  )}
                </div>
                <p className={`text-xs mt-2 font-medium ${item.isToday ? 'text-health-blue' : 'text-gray-600'}`}>
                  {item.day}
                </p>
                <p className="text-xs text-gray-500">
                  {item.steps > 0 ? (item.steps / 1000).toFixed(1) + 'k' : '0'}
                </p>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
          <span>0</span>
          <span className="text-center">Steps Progress</span>
          <span>{maxSteps > 0 ? (maxSteps / 1000).toFixed(1) + 'k' : '10k'}</span>
        </div>
      </div>
    </Card>
  );
};

export default WeeklyActivityChart;
