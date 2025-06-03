
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { dataService } from "@/services/dataService";
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
  streak: number;
  averageDaily: number;
}

export const useWaterData = () => {
  const { user } = useAuth();
  const [waterData, setWaterData] = useState<WaterData>({
    currentIntake: 0,
    dailyGoal: 2000,
    entries: [],
    weeklyData: [],
    streak: 0,
    averageDaily: 0
  });

  useEffect(() => {
    if (!user) return;

    const loadWaterData = async () => {
      try {
        const userData = await dataService.getUserData(user.id);
        if (userData.waterData) {
          setWaterData({
            ...userData.waterData,
            streak: calculateStreak(userData.waterData.weeklyData || []),
            averageDaily: calculateAverageDaily(userData.waterData.weeklyData || [])
          });
        } else {
          // Initialize with default data for new users
          const initialData = {
            currentIntake: 0,
            dailyGoal: 2000,
            entries: [],
            weeklyData: generateWeeklyData(),
            streak: 0,
            averageDaily: 0
          };
          setWaterData(initialData);
          await saveWaterData(initialData);
        }
      } catch (error) {
        console.error('Error loading water data:', error);
      }
    };

    loadWaterData();
  }, [user]);

  const saveWaterData = async (data: WaterData) => {
    if (!user) return;
    
    try {
      const userData = await dataService.getUserData(user.id);
      userData.waterData = data;
      await dataService.saveUserData(user.id, userData);
    } catch (error) {
      console.error('Error saving water data:', error);
    }
  };

  const generateWeeklyData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date().getDay();
    const todayIndex = today === 0 ? 6 : today - 1;
    
    return days.map((day, index) => ({
      day,
      amount: index <= todayIndex ? Math.floor(Math.random() * 1000) + 200 : 0
    }));
  };

  const calculateStreak = (weeklyData: { day: string; amount: number }[]) => {
    if (!weeklyData.length) return 0;
    
    let streak = 0;
    const today = new Date().getDay();
    const todayIndex = today === 0 ? 6 : today - 1;
    
    for (let i = todayIndex; i >= 0; i--) {
      if (weeklyData[i]?.amount >= 2000) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateAverageDaily = (weeklyData: { day: string; amount: number }[]) => {
    if (!weeklyData.length) return 0;
    
    const totalAmount = weeklyData.reduce((sum, day) => sum + (day.amount || 0), 0);
    const daysWithData = weeklyData.filter(day => day.amount > 0).length;
    
    return daysWithData > 0 ? Math.round(totalAmount / daysWithData) : 0;
  };

  const addWaterIntake = async (amount: number) => {
    const newIntake = Math.max(0, waterData.currentIntake + amount);
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    let newEntries = [...waterData.entries];
    
    if (amount > 0) {
      const newEntry = {
        time: currentTime,
        amount: amount,
        date: new Date().toDateString()
      };
      newEntries.push(newEntry);
      
      // Show motivational toast based on progress
      const progress = (newIntake / waterData.dailyGoal) * 100;
      let toastMessage = `Added ${amount}ml to your daily intake`;
      
      if (progress >= 100) {
        toastMessage = "🎉 Daily goal achieved! Great job!";
      } else if (progress >= 75) {
        toastMessage = `${amount}ml added! Almost there!`;
      } else if (progress >= 50) {
        toastMessage = `${amount}ml added! Halfway to your goal!`;
      }
      
      toast({
        title: "💧 Water added!",
        description: toastMessage,
        duration: 2000,
      });
    } else if (amount < 0 && newEntries.length > 0) {
      const removedEntry = newEntries.pop();
      if (removedEntry) {
        toast({
          title: "Water removed",
          description: `Removed ${Math.abs(amount)}ml from your daily intake`,
          duration: 2000,
        });
      }
    }

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
      weeklyData: newWeeklyData,
      streak: calculateStreak(newWeeklyData),
      averageDaily: calculateAverageDaily(newWeeklyData)
    };

    setWaterData(updatedData);
    await saveWaterData(updatedData);
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
