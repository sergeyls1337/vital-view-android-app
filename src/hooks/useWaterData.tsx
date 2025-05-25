
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface WaterEntry {
  time: string;
  amount: number;
  date: string;
}

interface WaterData {
  currentIntake: number;
  dailyGoal: number;
  entries: WaterEntry[];
  weeklyData: { day: string; amount: number }[];
}

export const useWaterData = () => {
  const [waterData, setWaterData] = useState<WaterData>({
    currentIntake: 0,
    dailyGoal: 2000,
    entries: [],
    weeklyData: []
  });

  useEffect(() => {
    // Load water data from localStorage
    const savedData = localStorage.getItem("waterData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setWaterData(parsed);
    } else {
      // Initialize with some sample data
      const initialData = {
        currentIntake: 1200,
        dailyGoal: 2000,
        entries: [
          { time: "8:00 AM", amount: 250, date: new Date().toDateString() },
          { time: "10:30 AM", amount: 300, date: new Date().toDateString() },
          { time: "12:45 PM", amount: 350, date: new Date().toDateString() },
          { time: "3:15 PM", amount: 300, date: new Date().toDateString() },
        ],
        weeklyData: generateWeeklyData()
      };
      setWaterData(initialData);
      localStorage.setItem("waterData", JSON.stringify(initialData));
    }
  }, []);

  const generateWeeklyData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date().getDay();
    const todayIndex = today === 0 ? 6 : today - 1; // Convert Sunday (0) to Saturday (6)
    
    return days.map((day, index) => ({
      day,
      amount: index <= todayIndex ? Math.floor(Math.random() * 1500) + 500 : 0
    }));
  };

  const addWaterIntake = (amount: number) => {
    const newIntake = Math.max(0, waterData.currentIntake + amount);
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    let newEntries = [...waterData.entries];
    
    if (amount > 0) {
      // Add new entry
      const newEntry = {
        time: currentTime,
        amount: amount,
        date: new Date().toDateString()
      };
      newEntries.push(newEntry);
      
      toast({
        title: "Water added!",
        description: `Added ${amount}ml to your daily intake`,
      });
    } else if (amount < 0 && newEntries.length > 0) {
      // Remove last entry when subtracting
      const removedEntry = newEntries.pop();
      if (removedEntry) {
        toast({
          title: "Water removed",
          description: `Removed ${Math.abs(amount)}ml from your daily intake`,
        });
      }
    }

    // Update weekly data for today
    const today = new Date().getDay();
    const todayIndex = today === 0 ? 6 : today - 1;
    const newWeeklyData = [...waterData.weeklyData];
    if (newWeeklyData[todayIndex]) {
      newWeeklyData[todayIndex].amount = newIntake;
    }

    const updatedData = {
      ...waterData,
      currentIntake: newIntake,
      entries: newEntries,
      weeklyData: newWeeklyData
    };

    setWaterData(updatedData);
    localStorage.setItem("waterData", JSON.stringify(updatedData));
  };

  const getTodayEntries = () => {
    const today = new Date().toDateString();
    return waterData.entries.filter(entry => entry.date === today);
  };

  return {
    ...waterData,
    addWaterIntake,
    getTodayEntries
  };
};
