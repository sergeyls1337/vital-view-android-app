
import { Minus, Plus, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import WaterAmountSelector from "./WaterAmountSelector";

interface WaterIntakeControlProps {
  onWaterIntakeChange: (amount: number) => void;
  currentIntake: number;
  dailyGoal: number;
}

const WaterIntakeControl = ({
  onWaterIntakeChange,
  currentIntake,
  dailyGoal,
}: WaterIntakeControlProps) => {
  const progress = Math.min(100, (currentIntake / dailyGoal) * 100);
  
  const handleAddWater = (amount: number) => {
    onWaterIntakeChange(amount);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mb-5">
        <div 
          className="absolute bottom-0 left-0 right-0 bg-blue-300/30 rounded-full transition-all duration-500 ease-out"
          style={{ height: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <Droplets className="text-health-blue h-8 w-8" />
          <span className="text-xl font-bold">{currentIntake} ml</span>
          <span className="text-xs text-gray-500">of {dailyGoal} ml</span>
        </div>
        <div 
          className="absolute inset-0 rounded-full border-4 border-blue-100"
        />
      </div>
      
      <div className="flex items-center gap-4 mt-4 mb-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 border-2"
          onClick={() => handleAddWater(-100)}
          disabled={currentIntake <= 0}
        >
          <Minus className="h-5 w-5" />
        </Button>
        
        <Button 
          className={cn(
            "rounded-full bg-health-blue text-white h-16 w-16 flex items-center justify-center hover:bg-blue-600"
          )}
          onClick={() => handleAddWater(250)}
        >
          <span className="text-lg font-semibold">+250</span>
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 border-2"
          onClick={() => handleAddWater(100)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      <WaterAmountSelector onAddWater={handleAddWater} />
    </div>
  );
};

export default WaterIntakeControl;
