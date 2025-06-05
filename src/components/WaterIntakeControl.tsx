
import { Minus, Plus, Droplets, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
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
  const wasGoalReached = Math.min(100, ((currentIntake - 250) / dailyGoal) * 100) >= 100;
  
  const handleAddWater = (amount: number) => {
    const newIntake = currentIntake + amount;
    const newProgress = Math.min(100, (newIntake / dailyGoal) * 100);
    
    onWaterIntakeChange(amount);
    
    // Show appropriate toast messages
    if (amount > 0) {
      if (newProgress >= 100 && !wasGoalReached) {
        toast.success("🎉 Daily water goal achieved!", {
          description: "Great job staying hydrated!",
          duration: 3000,
        });
      } else if (newProgress >= 75 && newProgress < 100) {
        toast.success(`💧 ${amount}ml added! Almost there!`, {
          description: `${Math.round(100 - newProgress)}% to go`,
          duration: 2000,
        });
      } else {
        toast.success(`💧 ${amount}ml added!`, {
          description: `${Math.round(newProgress)}% of daily goal`,
          duration: 1500,
        });
      }
    } else {
      toast.info(`Removed ${Math.abs(amount)}ml`, {
        description: "Water intake adjusted",
        duration: 1500,
      });
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40 mb-6">
        {/* Water container */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-100 bg-gradient-to-b from-blue-50 to-blue-100 overflow-hidden shadow-lg">
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out rounded-b-full",
              isGoalReached 
                ? "bg-gradient-to-t from-emerald-500 to-emerald-400 shadow-emerald-200 shadow-lg" 
                : "bg-gradient-to-t from-blue-400 to-blue-300"
            )}
            style={{ height: `${Math.max(10, progress)}%` }}
          >
            {/* Subtle wave effect */}
            <div className={cn(
              "absolute top-0 left-0 right-0 h-1 opacity-50 transition-colors duration-1000",
              isGoalReached ? "bg-emerald-300" : "bg-blue-300"
            )} />
          </div>
        </div>
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center flex-col z-10">
          <div className={cn(
            "flex items-center gap-2 mb-1 transition-colors duration-500",
            isGoalReached ? "text-emerald-600" : "text-blue-600"
          )}>
            <Droplets className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold text-foreground">{currentIntake}</span>
          <span className="text-sm text-muted-foreground">ml</span>
          <div className="mt-1 px-2 py-1 bg-white/90 rounded-full backdrop-blur-sm">
            <span className={cn(
              "text-xs font-medium transition-colors duration-500",
              isGoalReached ? "text-emerald-600" : "text-blue-600"
            )}>
              {Math.round(progress)}% of {dailyGoal}ml
            </span>
          </div>
        </div>
        
        {/* Goal achievement indicator */}
        {isGoalReached && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Droplets className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      
      {/* Progress indicators */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {[25, 50, 75, 100].map((milestone) => (
          <div 
            key={milestone}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-500 flex items-center justify-center",
              progress >= milestone 
                ? isGoalReached 
                  ? "bg-emerald-500 scale-110 shadow-emerald-200 shadow-md" 
                  : "bg-blue-500 scale-110"
                : "bg-gray-200"
            )}
          >
            {progress >= milestone && (
              <div className="w-1 h-1 bg-white rounded-full" />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-4 mt-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-14 w-14 border-2 hover:border-red-300 hover:bg-red-50 transition-all duration-300 hover:scale-105 active:scale-95"
          onClick={() => handleAddWater(-100)}
          disabled={currentIntake <= 0}
        >
          <Minus className="h-5 w-5" />
        </Button>
        
        <Button 
          className={cn(
            "rounded-full h-20 w-20 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg",
            isGoalReached 
              ? "bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-200" 
              : "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-200 hover:shadow-xl"
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
          className="rounded-full h-14 w-14 border-2 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:scale-105 active:scale-95"
          onClick={() => handleAddWater(100)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      <WaterAmountSelector onAddWater={handleAddWater} />
      
      {/* Enhanced motivational message */}
      {progress > 0 && progress < 100 && (
        <div className="mt-4 text-center animate-fade-in">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2">
              <Droplets className="h-4 w-4" />
              {progress < 25 && "Great start! Keep it up! 💪"}
              {progress >= 25 && progress < 50 && "You're doing well! 👍"}
              {progress >= 50 && progress < 75 && "Halfway there! 🎯"}
              {progress >= 75 && progress < 100 && "Almost there! You're so close! 🏁"}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {(dailyGoal - currentIntake).toLocaleString()}ml remaining
            </p>
          </div>
        </div>
      )}
      
      {isGoalReached && (
        <div className="mt-4 text-center animate-fade-in">
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-lg">
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2 mb-2">
              <Droplets className="h-5 w-5" />
              🎉 Daily Goal Achieved! 🎉
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              Excellent hydration! Keep it up tomorrow! 💧
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterIntakeControl;
