
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
  const [loading, setLoading] = useState(true);

  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const loadWaterData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Load user preferences for daily goal
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('water_goal')
        .eq('user_id', user.id)
        .single();

      const dailyGoal = preferences?.water_goal || 2000;

      // Load last 7 days of water entries
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: entries, error } = await supabase
        .from('water_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) {
        console.error('Error loading water data:', error);
        setLoading(false);
        return;
      }

      // Generate weekly data
      const weeklyData = generateWeeklyData(entries || []);
      
      // Get today's data
      const todayDateString = getTodayDateString();
      const todayEntry = entries?.find(e => e.date === todayDateString);
      
      const currentIntake = todayEntry?.total_intake || 0;
      // Parse the entries JSON field safely
      const todayEntries: WaterEntry[] = todayEntry?.entries 
        ? (Array.isArray(todayEntry.entries) ? todayEntry.entries as WaterEntry[] : [])
        : [];

      setWaterData({
        currentIntake,
        dailyGoal,
        entries: todayEntries,
        weeklyData,
        streak: calculateStreak(weeklyData, dailyGoal),
        averageDaily: calculateAverageDaily(weeklyData)
      });
    } catch (error) {
      console.error('Error loading water data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyData = (entries: any[]) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    
    return days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + index);
      const dateString = date.toISOString().split('T')[0];
      
      const entry = entries.find(e => e.date === dateString);
      return {
        day,
        amount: entry?.total_intake || 0
      };
    });
  };

  const calculateStreak = (weeklyData: { day: string; amount: number }[], dailyGoal: number) => {
    if (!weeklyData.length) return 0;
    
    let streak = 0;
    const today = new Date().getDay();
    const todayIndex = today === 0 ? 6 : today - 1;
    
    for (let i = todayIndex; i >= 0; i--) {
      if (weeklyData[i]?.amount >= dailyGoal) {
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

  useEffect(() => {
    loadWaterData();
  }, [user]);

  const addWaterIntake = async (amount: number) => {
    if (!user) return;

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

    try {
      const todayDateString = getTodayDateString();
      
      const { error } = await supabase
        .from('water_entries')
        .upsert({
          user_id: user.id,
          date: todayDateString,
          total_intake: newIntake,
          daily_goal: waterData.dailyGoal,
          entries: newEntries as any // Type cast to satisfy Supabase Json type
        });

      if (error) {
        console.error('Error saving water intake:', error);
        return;
      }

      // Update local state
      const today = new Date().getDay();
      const todayIndex = today === 0 ? 6 : today - 1;
      const newWeeklyData = [...waterData.weeklyData];
      if (newWeeklyData[todayIndex]) {
        newWeeklyData[todayIndex].amount = newIntake;
      }

      setWaterData({
        ...waterData,
        currentIntake: newIntake,
        entries: newEntries,
        weeklyData: newWeeklyData,
        streak: calculateStreak(newWeeklyData, waterData.dailyGoal),
        averageDaily: calculateAverageDaily(newWeeklyData)
      });
    } catch (error) {
      console.error('Error saving water intake:', error);
    }
  };

  const getTodayEntries = () => {
    const today = new Date().toDateString();
    return waterData.entries.filter(entry => entry.date === today);
  };

  return {
    ...waterData,
    loading,
    addWaterIntake,
    getTodayEntries
  };
};
