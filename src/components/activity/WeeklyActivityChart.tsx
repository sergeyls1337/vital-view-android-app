
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
  return (
    <Card className="p-5 mb-6">
      <h3 className="font-medium mb-3">Weekly Activity</h3>
      <div className="flex justify-between items-end h-40 pt-10">
        {weeklyActivities.map((item) => (
          <div key={item.day} className="flex flex-col items-center">
            <div 
              className={`w-8 rounded-t-md ${item.isToday ? 'bg-health-blue' : 'bg-gray-200'}`}
              style={{ height: `${item.heightPercent}%` }}
            />
            <p className="text-xs mt-2">{item.day}</p>
            <p className="text-xs text-gray-500">{item.steps > 0 ? (item.steps / 1000).toFixed(1) + 'k' : '-'}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WeeklyActivityChart;
