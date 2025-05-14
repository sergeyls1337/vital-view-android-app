
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import BottomNavigation from "@/components/BottomNavigation";
import SleepQualityChart from "@/components/SleepQualityChart";
import { Moon, Sunrise, Clock } from "lucide-react";

const sleepData = [
  { day: "Mon", hours: 7.5, quality: 8 },
  { day: "Tue", hours: 6.2, quality: 6 },
  { day: "Wed", hours: 8.0, quality: 9 },
  { day: "Thu", hours: 7.0, quality: 7 },
  { day: "Fri", hours: 6.5, quality: 6 },
  { day: "Sat", hours: 9.0, quality: 9 },
  { day: "Sun", hours: 8.0, quality: 8 },
];

const SleepPage = () => {
  return (
    <div className="pb-20 px-6 max-w-lg mx-auto">
      <PageHeader 
        title="Sleep Tracker" 
        description="Monitor your sleep patterns"
      />
      
      <Card className="p-5 mb-6">
        <h3 className="font-medium mb-4">Last Night's Sleep</h3>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-health-purple/20 flex items-center justify-center mr-4">
              <Moon className="text-health-purple h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="text-xl font-bold">7.5 hours</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Quality</p>
            <div className="flex">
              {[1, 2, 3, 4].map((star) => (
                <svg 
                  key={star} 
                  className="w-5 h-5 text-health-purple" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <svg 
                className="w-5 h-5 text-gray-300" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-100 rounded-lg p-3 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <Moon className="text-gray-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Bedtime</p>
              <p className="font-medium">11:30 PM</p>
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg p-3 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <Sunrise className="text-gray-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Wake up</p>
              <p className="font-medium">7:00 AM</p>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Weekly Overview</h3>
          <div className="flex items-center text-xs">
            <div className="flex items-center mr-3">
              <div className="w-3 h-3 bg-health-purple rounded-sm mr-1" />
              <span>Hours</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-health-teal rounded-sm mr-1" />
              <span>Quality</span>
            </div>
          </div>
        </div>
        
        <SleepQualityChart data={sleepData} />
      </Card>
      
      <Button
        className="w-full bg-health-purple hover:bg-purple-600"
      >
        Log Tonight's Sleep
      </Button>
      
      <BottomNavigation />
    </div>
  );
};

export default SleepPage;
