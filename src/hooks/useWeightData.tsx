
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

  // Load weight entries and user height from Supabase
  const loadWeightEntries = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Load user preferences for height
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('user_height')
        .eq('user_id', user.id)
        .single();

      if (preferences?.user_height) {
        setUserHeight(preferences.user_height);
      }

      // Load weight entries
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error loading weight entries:', error);
        toast.error('Failed to load weight data');
        return;
      }

      const formattedEntries: WeightEntry[] = data.map(entry => ({
        id: entry.id,
        date: entry.date,
        weight: entry.weight,
      }));

      setWeightEntries(formattedEntries);
    } catch (error) {
      console.error('Error loading weight entries:', error);
      toast.error('Failed to load weight data');
    } finally {
      setLoading(false);
    }
  };

  // Save weight entry to Supabase
  const saveWeightEntry = async (weight: number) => {
    if (!user) {
      toast.error('Please log in to save weight data');
      return false;
    }

    try {
      const today = new Date();
      const date = today.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('weight_entries')
        .upsert({
          user_id: user.id,
          date,
          weight
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving weight entry:', error);
        toast.error('Failed to save weight data');
        return false;
      }

      const newEntry: WeightEntry = {
        id: data.id,
        date: data.date,
        weight: data.weight,
      };
      
      setWeightEntries(prev => {
        const filtered = prev.filter(e => e.date !== date);
        return [...filtered, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      });

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

  const updateUserHeight = async (height: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          user_height: height
        });

      if (error) {
        console.error('Error updating user height:', error);
        return;
      }

      setUserHeight(height);
    } catch (error) {
      console.error('Error updating user height:', error);
    }
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
