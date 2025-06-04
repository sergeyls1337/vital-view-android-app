
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
}

export const useWeightData = () => {
  const { user } = useAuth();
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userHeight, setUserHeight] = useState(170); // Default height in cm

  // Load weight entries and user height from localStorage
  const loadWeightEntries = async () => {
    try {
      const savedWeightData = localStorage.getItem("weightData");
      const savedHeight = localStorage.getItem(`userHeight_${user?.id || 'default'}`);
      
      if (savedHeight) {
        setUserHeight(parseFloat(savedHeight));
      }
      
      if (savedWeightData) {
        const data = JSON.parse(savedWeightData);
        const formattedEntries: WeightEntry[] = data.map((entry: any, index: number) => ({
          id: `weight_${index}`,
          date: entry.date,
          weight: entry.weight,
        }));
        setWeightEntries(formattedEntries);
      } else {
        // Default data if nothing is saved yet
        const initialData = [
          { date: "May 1", weight: 77.5 },
          { date: "May 5", weight: 77.0 },
          { date: "May 9", weight: 76.2 },
          { date: "May 13", weight: 75.8 },
          { date: "May 17", weight: 75.0 },
          { date: "May 21", weight: 74.5 },
          { date: "May 25", weight: 75.0 },
        ];
        
        const formattedEntries: WeightEntry[] = initialData.map((entry, index) => ({
          id: `weight_${index}`,
          date: entry.date,
          weight: entry.weight,
        }));
        
        setWeightEntries(formattedEntries);
        localStorage.setItem("weightData", JSON.stringify(initialData));
      }
    } catch (error) {
      console.error('Error loading weight entries:', error);
      toast.error('Failed to load weight data');
    } finally {
      setLoading(false);
    }
  };

  // Save weight entry to localStorage
  const saveWeightEntry = async (weight: number) => {
    try {
      const today = new Date();
      const date = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const newEntry = { date, weight };
      const currentData = JSON.parse(localStorage.getItem("weightData") || "[]");
      const updatedData = [...currentData, newEntry];
      
      localStorage.setItem("weightData", JSON.stringify(updatedData));
      
      const formattedEntry: WeightEntry = {
        id: `weight_${Date.now()}`,
        date,
        weight,
      };
      
      setWeightEntries(prev => [...prev, formattedEntry]);
      toast.success('Weight data saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving weight entry:', error);
      toast.error('Failed to save weight data');
      return false;
    }
  };

  const getCurrentWeight = () => {
    return weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : 0;
  };

  const getCurrentBMI = () => {
    const currentWeight = getCurrentWeight();
    if (currentWeight === 0 || userHeight === 0) return 0;
    const heightInMeters = userHeight / 100;
    return +(currentWeight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-orange-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const updateUserHeight = (height: number) => {
    setUserHeight(height);
    localStorage.setItem(`userHeight_${user?.id || 'default'}`, height.toString());
  };

  useEffect(() => {
    loadWeightEntries();
  }, [user]);

  return {
    weightEntries,
    loading,
    saveWeightEntry,
    loadWeightEntries,
    getCurrentWeight,
    getCurrentBMI,
    getBMICategory,
    userHeight,
    updateUserHeight,
  };
};
