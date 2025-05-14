
import { Button } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActivityType } from "@/types/activity";

interface ActivityTypeSelectorProps {
  activityTypes: ActivityType[];
  selectedActivityType: ActivityType;
  isTracking: boolean;
  onSelectActivity: (activityType: ActivityType) => void;
}

const ActivityTypeSelector = ({
  activityTypes,
  selectedActivityType,
  isTracking,
  onSelectActivity
}: ActivityTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {activityTypes.map((activity) => (
        <Button 
          key={activity}
          variant="outline"
          className={`h-20 flex flex-col justify-center items-center border-2 ${
            isTracking && selectedActivityType === activity ? 'border-health-blue' : ''
          }`}
          onClick={() => onSelectActivity(activity)}
        >
          <Activity className="h-5 w-5 mb-1" />
          <span className="text-xs">{activity.charAt(0).toUpperCase() + activity.slice(1)}</span>
        </Button>
      ))}
    </div>
  );
};

export default ActivityTypeSelector;
