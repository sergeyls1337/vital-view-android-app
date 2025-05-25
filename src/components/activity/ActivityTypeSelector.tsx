import { Button } from "@/components/ui/button";
import { Activity, Bike, Mountain, Waves, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActivityType } from "@/types/activity";

interface ActivityTypeSelectorProps {
  activityTypes: ActivityType[];
  selectedActivityType: ActivityType;
  isTracking: boolean;
  onSelectActivity: (activityType: ActivityType) => void;
}

const getActivityIcon = (activityType: ActivityType) => {
  switch (activityType) {
    case "walking":
      return <Activity className="h-6 w-6 mb-2" />;
    case "running":
      return <Activity className="h-6 w-6 mb-2" />;
    case "cycling":
      return <Bike className="h-6 w-6 mb-2" />;
    case "hiking":
      return <Mountain className="h-6 w-6 mb-2" />;
    case "swimming":
      return <Waves className="h-6 w-6 mb-2" />;
    case "gym":
      return <Dumbbell className="h-6 w-6 mb-2" />;
    default:
      return <Activity className="h-6 w-6 mb-2" />;
  }
};

const ActivityTypeSelector = ({
  activityTypes,
  selectedActivityType,
  isTracking,
  onSelectActivity
}: ActivityTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-lg mb-2">Choose Activity Type</h3>
        <p className="text-sm text-gray-600 mb-4">
          {isTracking ? "Currently tracking" : "Select an activity to start tracking"}
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {activityTypes.map((activity) => (
          <Button 
            key={activity}
            variant="outline"
            className={cn(
              "h-24 flex flex-col justify-center items-center border-2 transition-all duration-200",
              isTracking && selectedActivityType === activity 
                ? 'border-health-blue bg-health-blue/10 text-health-blue' 
                : 'hover:border-health-blue/50'
            )}
            onClick={() => onSelectActivity(activity)}
          >
            {getActivityIcon(activity)}
            <span className="text-xs font-medium">
              {activity.charAt(0).toUpperCase() + activity.slice(1)}
            </span>
            {isTracking && selectedActivityType === activity && (
              <span className="text-xs text-health-blue mt-1">● Active</span>
            )}
          </Button>
        ))}
      </div>
      
      {isTracking && (
        <div className="text-center p-3 bg-health-blue/10 rounded-lg">
          <p className="text-sm text-health-blue font-medium">
            Tracking {selectedActivityType} activity
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityTypeSelector;
