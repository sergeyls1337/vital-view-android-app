
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface SleepEntry {
  id: string;
  date: string;
  hours: number;
  quality: number;
  bedtime: string;
  wakeTime: string;
}

export const useSleepData = () => {
  const { user } = useAuth();
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  // Load sleep entries from Supabase
  const loadSleepEntries = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('sleep_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading sleep entries:', error);
        toast.error('Failed to load sleep data');
        return;
      }

      const formattedEntries: SleepEntry[] = data.map(entry => ({
        id: entry.id,
        date: entry.date,
        hours: entry.hours,
        quality: entry.quality,
        bedtime: entry.bedtime,
        wakeTime: entry.wake_time,
      }));

      setSleepEntries(formattedEntries);
      calculateStreak(formattedEntries);
    } catch (error) {
      console.error('Error loading sleep entries:', error);
      toast.error('Failed to load sleep data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate the current sleep streak
  const calculateStreak = (entries: SleepEntry[]) => {
    if (!entries.length) {
      setStreak(0);
      return;
    }

    // Sort entries by date (newest first)
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let currentDate = today;
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      
      // Check if this entry is for today or a consecutive previous day
      const dayDifference = Math.floor(
        (currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // If this is the first entry (today) or there's a 1-day gap (consecutive days)
      if (currentStreak === 0 || dayDifference === 1) {
        // Check if the sleep meets the quality threshold (e.g., at least 7 hours)
        if (entry.hours >= 7) {
          currentStreak++;
          // Move to the next expected date
          currentDate = entryDate;
        } else {
          // Break the streak if sleep quality isn't good
          break;
        }
      } else if (dayDifference === 0) {
        // Multiple entries for the same day, just continue
        continue;
      } else {
        // Gap in the dates, streak is broken
        break;
      }
    }
    
    setStreak(currentStreak);
  };

  // Save sleep entry to Supabase
  const saveSleepEntry = async (entry: Omit<SleepEntry, 'id'>) => {
    if (!user) {
      toast.error('Please log in to save sleep data');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('sleep_entries')
        .upsert({
          user_id: user.id,
          date: entry.date,
          hours: entry.hours,
          quality: entry.quality,
          bedtime: entry.bedtime,
          wake_time: entry.wakeTime,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving sleep entry:', error);
        toast.error('Failed to save sleep data');
        return false;
      }

      const newEntry: SleepEntry = {
        id: data.id,
        date: data.date,
        hours: data.hours,
        quality: data.quality,
        bedtime: data.bedtime,
        wakeTime: data.wake_time,
      };

      // Update local state
      setSleepEntries(prev => {
        const filtered = prev.filter(e => e.date !== entry.date);
        const newEntries = [newEntry, ...filtered].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        // Recalculate streak with the updated entries
        calculateStreak(newEntries);
        
        return newEntries;
      });

      toast.success('Sleep data saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving sleep entry:', error);
      toast.error('Failed to save sleep data');
      return false;
    }
  };

  useEffect(() => {
    loadSleepEntries();
  }, [user]);

  return {
    sleepEntries,
    loading,
    saveSleepEntry,
    loadSleepEntries,
    streak
  };
};
