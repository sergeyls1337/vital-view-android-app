
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/PageHeader";
import BottomNavigation from "@/components/BottomNavigation";
import WeightTrackChart from "@/components/WeightTrackChart";
import { TrendingDown, ChevronDown } from "lucide-react";

const weightData = [
  { date: "May 1", weight: 77.5 },
  { date: "May 5", weight: 77.0 },
  { date: "May 9", weight: 76.2 },
  { date: "May 13", weight: 75.8 },
  { date: "May 17", weight: 75.0 },
  { date: "May 21", weight: 74.5 },
  { date: "May 25", weight: 75.0 },
];

const WeightPage = () => {
  const [weight, setWeight] = useState("");
  const goalWeight = 70;
  
  const handleAddWeight = () => {
    // In a real app, this would add the weight to the dataset
    setWeight("");
    // For demo purposes we're not actually updating the chart data
  };
  
  return (
    <div className="pb-20 px-6 max-w-lg mx-auto">
      <PageHeader 
        title="Weight Tracking" 
        description="Monitor your weight progress"
      />
      
      <Card className="p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Current Weight</h3>
          <div className="flex items-center text-health-green">
            <TrendingDown className="h-4 w-4 mr-1" />
            <span className="text-sm">-2.5 kg</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500">Current</p>
            <p className="text-2xl font-bold">75.0 kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Goal</p>
            <p className="text-2xl font-bold text-health-green">70.0 kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Left</p>
            <p className="text-2xl font-bold text-health-blue">5.0 kg</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="relative flex-grow">
            <Input
              type="number"
              placeholder="Enter weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="pr-10"
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <span className="text-gray-500">kg</span>
            </div>
          </div>
          <Button 
            className="bg-health-blue hover:bg-blue-600"
            onClick={handleAddWeight}
          >
            Add
          </Button>
        </div>
      </Card>
      
      <Card className="p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Progress Chart</h3>
          <div className="flex items-center text-sm text-gray-500">
            <span>May 2023</span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </div>
        </div>
        
        <WeightTrackChart data={weightData} goalWeight={goalWeight} />
      </Card>
      
      <Card className="p-5">
        <h3 className="font-medium mb-3">Weight History</h3>
        <div className="space-y-1">
          {weightData.map((entry, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span>{entry.date}</span>
              <span className="font-medium">{entry.weight} kg</span>
            </div>
          ))}
        </div>
      </Card>
      
      <BottomNavigation />
    </div>
  );
};

export default WeightPage;
