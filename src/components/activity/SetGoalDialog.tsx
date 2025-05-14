
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface SetGoalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newStepsGoal: string;
  setNewStepsGoal: (goal: string) => void;
  onUpdateGoal: () => void;
}

const SetGoalDialog = ({
  isOpen,
  onOpenChange,
  newStepsGoal,
  setNewStepsGoal,
  onUpdateGoal
}: SetGoalDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Daily Goal</DialogTitle>
          <DialogDescription>
            Update your daily step count goal
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Daily Step Goal</label>
            <Input
              type="number"
              placeholder="Enter goal"
              value={newStepsGoal}
              onChange={(e) => setNewStepsGoal(e.target.value)}
              className="w-full mb-2"
            />
            <div className="pt-4">
              <label className="text-sm font-medium mb-2 block">Quick Select</label>
              <div className="flex flex-wrap gap-2">
                {[5000, 7500, 10000, 12500, 15000].map((goal) => (
                  <Button
                    key={goal}
                    type="button"
                    variant={newStepsGoal === goal.toString() ? "default" : "outline"}
                    className="text-xs py-1"
                    onClick={() => setNewStepsGoal(goal.toString())}
                  >
                    {goal.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-health-blue hover:bg-blue-600" onClick={onUpdateGoal}>
            Update Goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SetGoalDialog;
