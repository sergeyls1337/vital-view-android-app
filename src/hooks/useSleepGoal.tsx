
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useSleepGoal = () => {
  const { user } = useAuth();
  const [sleepGoal, setSleepGoal] = useState(8); // Default 8 hours
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadSleepGoal = async () => {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('sleep_goal')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading sleep goal:', error);
          setLoading(false);
          return;
        }

        if (data?.sleep_goal) {
          setSleepGoal(data.sleep_goal);
        }
      } catch (error) {
        console.error('Error loading sleep goal:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSleepGoal();
  }, [user]);

  const updateSleepGoal = async (newGoal: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          sleep_goal: newGoal
        });

      if (error) {
        console.error('Error updating sleep goal:', error);
        return;
      }

      setSleepGoal(newGoal);
    } catch (error) {
      console.error('Error updating sleep goal:', error);
    }
  };

  return {
    sleepGoal,
    updateSleepGoal,
    loading
  };
};
