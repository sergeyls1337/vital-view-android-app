
import { Button } from "@/components/ui/button";
import { Activity, Bike, Mountain, Waves, Dumbbell, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActivityType } from "@/types/activity";
import { useLanguage } from "@/contexts/LanguageContext";

interface ActivityTypeSelectorProps {
  activityTypes: ActivityType[];
  selectedActivityType: ActivityType;
  isTracking: boolean;
  onSelectActivity: (activityType: ActivityType) => void;
}

const getActivityIcon = (activityType: ActivityType) => {
  switch (activityType) {
    case "walking":
      return <MapPin className="h-6 w-6 mb-2" />;
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

const getActivityColor = (activityType: ActivityType) => {
  switch (activityType) {
    case "walking":
      return "text-green-500 border-green-500 bg-green-50";
    case "running":
      return "text-red-500 border-red-500 bg-red-50";
    case "cycling":
      return "text-blue-500 border-blue-500 bg-blue-50";
    case "hiking":
      return "text-orange-500 border-orange-500 bg-orange-50";
    case "swimming":
      return "text-cyan-500 border-cyan-500 bg-cyan-50";
    case "gym":
      return "text-purple-500 border-purple-500 bg-purple-50";
    default:
      return "text-gray-500 border-gray-500 bg-gray-50";
  }
};

const ActivityTypeSelector = ({
  activityTypes,
  selectedActivityType,
  isTracking,
  onSelectActivity
}: ActivityTypeSelectorProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">{t('activity.quickStart')}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {isTracking ? `Currently tracking ${t(`activity.${selectedActivityType}`)}` : "Select an activity to start tracking"}
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {activityTypes.map((activity) => {
          const isSelected = isTracking && selectedActivityType === activity;
          const colorClasses = getActivityColor(activity);
          
          return (
            <Button 
              key={activity}
              variant="outline"
              className={cn(
                "h-24 flex flex-col justify-center items-center border-2 transition-all duration-300 hover:scale-105 active:scale-95",
                isSelected 
                  ? `${colorClasses} shadow-lg scale-105 animate-pulse` 
                  : 'hover:border-health-blue/50 hover:bg-health-blue/5'
              )}
              onClick={() => onSelectActivity(activity)}
            >
              <div className={cn(
                "transition-colors duration-300",
                isSelected ? "" : "text-muted-foreground"
              )}>
                {getActivityIcon(activity)}
              </div>
              <span className={cn(
                "text-xs font-medium transition-colors duration-300",
                isSelected ? "" : "text-muted-foreground"
              )}>
                {t(`activity.${activity}`)}
              </span>
              {isSelected && (
                <div className="flex items-center justify-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  <span className="text-xs ml-1 font-semibold">Active</span>
                </div>
              )}
            </Button>
          );
        })}
      </div>
      
      {isTracking && (
        <div className={cn(
          "text-center p-4 rounded-lg border-2 animate-fade-in",
          getActivityColor(selectedActivityType)
        )}>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-current animate-pulse" />
            <p className="text-sm font-semibold">
              Tracking {t(`activity.${selectedActivityType}`)} activity
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityTypeSelector;
