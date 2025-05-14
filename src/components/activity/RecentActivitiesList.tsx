
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DailyActivity } from "@/types/activity";

interface RecentActivitiesListProps {
  recentActivities: DailyActivity[];
  onViewAllClick: () => void;
}

const RecentActivitiesList = ({ recentActivities, onViewAllClick }: RecentActivitiesListProps) => {
  return (
    <Card className="p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Recent Activities</h3>
        <Button 
          variant="ghost" 
          className="text-sm h-8 px-2"
          onClick={onViewAllClick}
        >
          View All
        </Button>
      </div>
      {recentActivities.map((activity, index) => (
        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
          <div>
            <p className="text-sm font-medium">{activity.date}</p>
            <p className="text-xs text-gray-500">{activity.activityType || 'walking'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">{activity.steps.toLocaleString()} steps</p>
            <p className="text-xs text-gray-500">{activity.distance} km</p>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default RecentActivitiesList;
