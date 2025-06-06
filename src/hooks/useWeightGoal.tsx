
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useWeightGoal = () => {
  const { user } = useAuth();
  const [goalWeight, setGoalWeight] = useState(70); // Default goal
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadGoalWeight = async () => {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('weight_goal')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading weight goal:', error);
          setLoading(false);
          return;
        }

        if (data?.weight_goal) {
          setGoalWeight(data.weight_goal);
        }
      } catch (error) {
        console.error('Error loading weight goal:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGoalWeight();
  }, [user]);

  const updateGoalWeight = async (newGoal: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          weight_goal: newGoal
        });

      if (error) {
        console.error('Error updating weight goal:', error);
        return;
      }

      setGoalWeight(newGoal);
    } catch (error) {
      console.error('Error updating weight goal:', error);
    }
  };

  return {
    goalWeight,
    updateGoalWeight,
    loading
  };
};
