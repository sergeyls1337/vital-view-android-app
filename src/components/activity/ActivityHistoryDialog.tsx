
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DailyActivity } from "@/types/activity";

interface ActivityHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activities: DailyActivity[];
}

const ActivityHistoryDialog = ({
  isOpen,
  onOpenChange,
  activities
}: ActivityHistoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Activity History</DialogTitle>
          <DialogDescription>
            View your complete activity history
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {activities.length === 0 ? (
            <p className="text-center text-gray-500">No activities recorded yet</p>
          ) : (
            activities.map((activity, index) => (
              <div key={index} className="mb-4 p-3 border rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">{activity.date}</p>
                  <p className="text-sm text-gray-500">{activity.activityType || 'walking'}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Steps</p>
                    <p className="font-bold">{activity.steps.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Distance</p>
                    <p className="font-bold">{activity.distance} km</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Calories</p>
                    <p className="font-bold">{activity.calories} kcal</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-bold">{activity.duration} min</p>
                  </div>
                </div>
              </div>
            )).reverse()
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityHistoryDialog;
