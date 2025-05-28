
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
    } catch (error) {
      console.error('Error loading sleep entries:', error);
      toast.error('Failed to load sleep data');
    } finally {
      setLoading(false);
    }
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
        return [newEntry, ...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
  };
};
