
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ActivityType } from "@/types/activity";

interface AddActivityDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activityTypes: ActivityType[];
  selectedActivityType: ActivityType;
  setSelectedActivityType: (type: ActivityType) => void;
  newSteps: string;
  setNewSteps: (steps: string) => void;
  onAddActivity: () => void;
}

const AddActivityDialog = ({
  isOpen,
  onOpenChange,
  activityTypes,
  selectedActivityType,
  setSelectedActivityType,
  newSteps,
  setNewSteps,
  onAddActivity
}: AddActivityDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Steps</DialogTitle>
          <DialogDescription>
            Enter your step count and select activity type
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Steps</label>
            <Input
              type="number"
              placeholder="Enter steps"
              value={newSteps}
              onChange={(e) => setNewSteps(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Activity Type</label>
            <div className="grid grid-cols-3 gap-2">
              {activityTypes.map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={selectedActivityType === type ? "default" : "outline"}
                  className="text-xs py-1"
                  onClick={() => setSelectedActivityType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-health-blue hover:bg-blue-600" onClick={onAddActivity}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddActivityDialog;
