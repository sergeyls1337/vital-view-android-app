
import { Minus, Plus, Droplets, Target, TrendingUp } from "lucide-react";
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
  const isGoalReached = progress >= 100;
  
  const handleAddWater = (amount: number) => {
    onWaterIntakeChange(amount);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40 mb-6">
        {/* Water container with wave effect */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-100 bg-gradient-to-b from-blue-50 to-blue-100 overflow-hidden">
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out rounded-b-full",
              isGoalReached 
                ? "bg-gradient-to-t from-blue-500 to-blue-400 animate-pulse" 
                : "bg-gradient-to-t from-blue-300 to-blue-200"
            )}
            style={{ height: `${Math.max(10, progress)}%` }}
          >
            {/* Wave animation */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-blue-400 opacity-60 animate-pulse" />
          </div>
        </div>
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center flex-col z-10">
          <div className={cn(
            "flex items-center gap-2 mb-1 transition-colors duration-300",
            isGoalReached ? "text-blue-600" : "text-health-blue"
          )}>
            {isGoalReached ? (
              <Target className="h-6 w-6 animate-bounce" />
            ) : (
              <Droplets className="h-6 w-6" />
            )}
          </div>
          <span className="text-2xl font-bold text-foreground">{currentIntake}</span>
          <span className="text-sm text-muted-foreground">ml</span>
          <div className="mt-1 px-2 py-1 bg-white/80 rounded-full">
            <span className="text-xs font-medium text-health-blue">
              {Math.round(progress)}% of {dailyGoal}ml
            </span>
          </div>
        </div>
        
        {/* Goal achievement celebration */}
        {isGoalReached && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <Target className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      
      {/* Progress indicators */}
      <div className="flex items-center justify-center gap-1 mb-4">
        {[25, 50, 75, 100].map((milestone) => (
          <div 
            key={milestone}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              progress >= milestone 
                ? "bg-blue-500 scale-110" 
                : "bg-gray-200"
            )}
          />
        ))}
      </div>
      
      <div className="flex items-center gap-4 mt-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-14 w-14 border-2 hover:border-red-300 hover:bg-red-50 transition-all duration-300"
          onClick={() => handleAddWater(-100)}
          disabled={currentIntake <= 0}
        >
          <Minus className="h-5 w-5" />
        </Button>
        
        <Button 
          className={cn(
            "rounded-full h-20 w-20 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95",
            isGoalReached 
              ? "bg-gradient-to-br from-green-500 to-green-600 shadow-lg animate-pulse" 
              : "bg-gradient-to-br from-health-blue to-blue-600 shadow-lg hover:shadow-xl"
          )}
          onClick={() => handleAddWater(250)}
        >
          <div className="text-center">
            <div className="text-lg font-bold">+250</div>
            <div className="text-xs opacity-90">ml</div>
          </div>
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-14 w-14 border-2 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
          onClick={() => handleAddWater(100)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      <WaterAmountSelector onAddWater={handleAddWater} />
      
      {/* Motivational message */}
      {progress > 0 && progress < 100 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {progress < 25 && "Great start! Keep it up!"}
            {progress >= 25 && progress < 50 && "You're doing well!"}
            {progress >= 50 && progress < 75 && "Halfway there!"}
            {progress >= 75 && progress < 100 && "Almost there!"}
          </p>
        </div>
      )}
      
      {isGoalReached && (
        <div className="mt-4 text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-700 flex items-center justify-center gap-1">
            <Target className="h-4 w-4" />
            Goal achieved! Stay hydrated! 🎉
          </p>
        </div>
      )}
    </div>
  );
};

export default WaterIntakeControl;
