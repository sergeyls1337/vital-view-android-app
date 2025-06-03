
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Edit3 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface SleepGoalCardProps {
  currentHours: number;
  goalHours: number;
  onGoalUpdate: (newGoal: number) => void;
}

const SleepGoalCard = ({ currentHours, goalHours, onGoalUpdate }: SleepGoalCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(goalHours);

  const progress = Math.min((currentHours / goalHours) * 100, 100);
  const isGoalMet = currentHours >= goalHours;

  const handleSaveGoal = () => {
    if (tempGoal > 0 && tempGoal <= 12) {
      onGoalUpdate(tempGoal);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setTempGoal(goalHours);
    setIsEditing(false);
  };

  return (
    <Card className="p-5 mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Target className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="font-medium text-blue-900">Sleep Goal</h3>
        </div>
        
        {!isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:bg-blue-100"
          >
            <Edit3 className="h-3 w-3 mr-1" />
            Edit
          </Button>
        ) : (
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
              className="text-gray-600"
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveGoal}
              className="text-blue-600"
            >
              Save
            </Button>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Target:</span>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={tempGoal}
                onChange={(e) => setTempGoal(parseFloat(e.target.value) || 0)}
                className="w-16 h-8 text-center"
                min="1"
                max="12"
                step="0.5"
              />
              <span className="text-sm text-gray-600">hours</span>
            </div>
          ) : (
            <span className="font-semibold text-blue-600">{goalHours}h</span>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className={`font-medium ${isGoalMet ? 'text-green-600' : 'text-gray-600'}`}>
              {currentHours}h / {goalHours}h
            </span>
          </div>
          <Progress 
            value={progress} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0h</span>
            <span>{goalHours}h</span>
          </div>
        </div>
        
        {isGoalMet && (
          <div className="bg-green-100 p-3 rounded-lg text-center">
            <span className="text-green-800 font-medium text-sm">🎉 Goal achieved!</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SleepGoalCard;
