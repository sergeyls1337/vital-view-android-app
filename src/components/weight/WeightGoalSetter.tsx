
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Edit3, Save, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface WeightGoalSetterProps {
  goalWeight: number;
  onGoalChange: (newGoal: number) => void;
}

const WeightGoalSetter = ({ goalWeight, onGoalChange }: WeightGoalSetterProps) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(goalWeight);
  
  const handleSave = () => {
    if (tempGoal > 0 && tempGoal < 200) {
      onGoalChange(tempGoal);
      setIsEditing(false);
      toast.success(`Goal weight updated to ${tempGoal} kg`);
    } else {
      toast.error("Please enter a valid weight between 1-200 kg");
    }
  };
  
  const handleCancel = () => {
    setTempGoal(goalWeight);
    setIsEditing(false);
  };
  
  return (
    <Card className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">{t('weight.goalWeight')}</h3>
        {!isEditing ? (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-green-600 hover:text-green-700"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSave}
              className="text-green-600 hover:text-green-700"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {!isEditing ? (
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600 mb-2">{goalWeight} kg</p>
          <p className="text-sm text-gray-600">{t('weight.clickToEdit')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="goal-input" className="text-sm font-medium">
              {t('weight.targetWeight')}
            </Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                id="goal-input"
                type="number"
                value={tempGoal}
                onChange={(e) => setTempGoal(parseFloat(e.target.value) || 0)}
                className="flex-1"
                step="0.1"
                min="30"
                max="200"
              />
              <span className="text-sm text-gray-500">kg</span>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {t('weight.quickSelect')}: {tempGoal} kg
            </Label>
            <Slider
              value={[tempGoal]}
              onValueChange={(value) => setTempGoal(value[0])}
              max={120}
              min={40}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>40kg</span>
              <span>120kg</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default WeightGoalSetter;
